#!/usr/bin/env python3
"""Build a small offline APK using the official SDK; signing secrets stay external."""
from pathlib import Path
import os,subprocess,shutil,json,zipfile,hashlib
root=Path(__file__).resolve().parents[1]
sdk=Path(os.environ['ANDROID_SDK_ROOT']);jdk=Path(os.environ['JAVA_HOME']);tools=sdk/'build-tools/35.0.0';platform=sdk/'platforms/android-35/android.jar'
key=Path(os.environ['RENK_KEYSTORE_PATH']);password=Path(os.environ['RENK_STORE_PASS_FILE'])
version=json.loads((root/'package.json').read_text())['version'];build=root/'android/build';out=root/'dist'/f'renk-duragi-{version}.apk'
if build.exists():shutil.rmtree(build)
for d in ['assets','gen','classes','dex']:(build/d).mkdir(parents=True,exist_ok=True)
shutil.copyfile(root/'dist'/f'renk-duragi-{version}.html',build/'assets/game.html')
env=dict(os.environ,PATH=str(jdk/'bin')+os.pathsep+os.environ['PATH'])
def run(*args):
    result=subprocess.run(list(map(str,args)),env=env,capture_output=True,text=True)
    if result.returncode:raise RuntimeError(str(args[0])+': '+result.stdout+result.stderr)
    return result.stdout
run(tools/'aapt2','compile','--dir',root/'android/res','-o',build/'resources.zip')
run(tools/'aapt2','link','-o',build/'unsigned.apk','-I',platform,'--manifest',root/'android/AndroidManifest.xml','--java',build/'gen','-A',build/'assets','--min-sdk-version','26','--target-sdk-version','35',build/'resources.zip')
sources=list((root/'android/src').rglob('*.java'))+list((build/'gen').rglob('*.java'))
run(jdk/'bin/javac','-encoding','UTF-8','--release','8','-classpath',platform,'-d',build/'classes',*sources)
run(tools/'d8','--release','--min-api','26','--lib',platform,'--output',build/'dex',*list((build/'classes').rglob('*.class')))
with zipfile.ZipFile(build/'unsigned.apk','a',compression=zipfile.ZIP_DEFLATED)as z:z.write(build/'dex/classes.dex','classes.dex')
run(tools/'zipalign','-f','-p','4',build/'unsigned.apk',build/'aligned.apk')
run(tools/'apksigner','sign','--ks',key,'--ks-key-alias','renk','--ks-pass','file:'+str(password),'--out',out,build/'aligned.apk')
verification=run(tools/'apksigner','verify','--verbose','--print-certs',out)
run(tools/'zipalign','-c','-p','4',out)
badging=run(tools/'aapt','dump','badging',out);permissions=run(tools/'aapt','dump','permissions',out)
assert 'uses-permission:' not in permissions,permissions
assert "package: name='com.gokhanagingil.renk'" in badging
with zipfile.ZipFile(out)as z:
 assert hashlib.sha256(z.read('assets/game.html')).digest()==hashlib.sha256((build/'assets/game.html').read_bytes()).digest()
 assert 'classes.dex'in z.namelist()
report={'version':version,'package':'com.gokhanagingil.renk','minSdk':26,'targetSdk':35,'permissions':[], 'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'verification':verification.splitlines(),'launchable':next(l for l in badging.splitlines()if l.startswith('launchable-activity:')),'offlineAssetsIdentical':True,'physicalDeviceTested':False}
(root/'qa/apk-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:report[k]for k in ['version','package','bytes','sha256','permissions','offlineAssetsIdentical']},indent=2));print('Signed APK:',out)
