# Renk Durağı — 0.7.0

**Yolu aç, peronda yer bırak, yolcuları koltuklarına yerleştir.**

500 sabit bölüm ve çevrimdışı Android uygulaması. Süre sınırı, reklam, ödeme veya can sistemi yoktur. Ücretsiz ipucu ve geri alma vardır.

[Tarayıcı sürümü: renk-duragi-0.7.0.html](dist/renk-duragi-0.7.0.html). İndirip tarayıcıda aç; internet, hesap veya ek dosya gerekmez. GitHub dosya görüntüleyicisi oyunu çalıştırmaz. İmzalı APK ayrı dosya olarak teslim edilir; ikili dosya ve imza anahtarı bu depoda tutulmaz.

## 500 bölümlük kampanya

- Harita 25 gruba ayrılır; her grupta 20 bölüm görünür. Bölüm numarasıyla doğrudan geçiş ve tamamlanma işaretleri vardır.
- İlk öğretici bölüm korunur. Devamı araç sayısı, fiziksel engeller, engel zinciri, koltuk çeşitliliği, renkler ve kuyruk değişimleri birlikte değerlendirilerek sıralanır.
- Altı koltuklu ilk araç 30., dördüncü renk 154. bölümde gelir. Önceki 24 bölümün 13'ü yeni karmaşıklık sınırını aştığından aktif kampanyadan çıkarıldı; kaynakları ve eski dağıtımları korunur. Uygun 11 eski bölüme 489 yeni düzen eklendi.
- Son bölümlerde bile en fazla 28 araç, 120 yolcu, 4 renk ve 5 araçlık engel zinciri vardır. Bütün bölümlerde en fazla iki peron gerektiren bir çözüm yolu doğrulanır; üçüncü peron manevra payıdır.
- 489 yeni düzen döndürme ve yansıtma altında da birbirinden farklıdır. Eski özel rotaların bazıları dönmüş varyantlardır.

Zorluk puanı bir tasarım ölçüsüdür; insanlarla ölçülmüş başarı oranı değildir. Bölümlerin çözülebilirliği otomatik doğrulandı; hissedilen zorluk, süre ve keyif oyuncu denemeleriyle ayarlanmalıdır.

## Oyun

1. Araca dokun. Önündeki hat park sınırına kadar açıksa ok yönünde çıkar.
2. Üç peron vardır. Yola çıkan araç hemen bir yer ayırır. Diğer araçları göndermek için animasyonların bitmesini beklemek gerekmez.
3. Yolcular sırayla kendi renklerindeki araca biner. Aynı renkte önce gönderilen araç önceliklidir.
4. Dolu araç ayrılınca peronu boşalır; kısmen dolu araç bekler.
5. Yanlış araçlarla peronu doldurmak kilitlenebilir. Geri al veya yeniden dene.
6. Bütün yolcular binip araçlar ayrıldığında bölüm biter.

Sakin (1×, varsayılan), Normal (1,3×) ve Hızlı (2×) devam eden hareketleri de etkiler. Hareket azaltma tercihi desteklenir. Tam park görünümü ve en az 44 piksel kısa kenar veren yakınlaştırma vardır. Renkler şekillerle de belirtilir.

Kuyrukta yürüyen yolcular, kapıdan koltuğa biniş, görünür doluluk, beş bölge görünümü, küçük yolcu hareketleri ve isteğe bağlı ses korunur. Bekleyenlerin sinirlenmesi veya tuvalet ihtiyacı yalnızca görseldir; kaybetme sebebi değildir. Bölüm sonunda ekran kararmaz.

## Android

Paket: `com.gokhanagingil.renk`, sürüm `0.7.0` / kod `70`. Android 8.0 ve üzeri; güncel Android System WebView önerilir. Oyun HTML'i APK içine gömülür. İnternet, dosya erişimi veya başka bir Android izni istemez. Kayıt yerel tutulur; uygulama verilerini silmek veya kaldırmak kaydı kaybettirebilir. Aynı imzayla güncelleme için imza anahtarı ayrıca saklanır.

Geri tuşu açık pencereyi kapatır; oyundayken çıkış onayı gösterir. Arka plana geçişte hareketler duraklatılır ve kayıt alınır. APK v2/v3 imzası, paket/izinler ve gömülü dosya doğrulandı. Bu sürüm henüz fiziksel cihazda veya Android emülatöründe çalıştırılmadı; tarayıcıda mobil yerleşim ve oyun akışı test edildi.

## Kayıt uyumluluğu

0.7 kayıtları bölüm sırası yerine sabit bölüm kimliği kullanır. Aynı tarayıcı alanında bulunan 0.4.1–0.6 kayıtları, aktif kampanyada kalan bölümler için kimlikle eşleştirilir. Çıkarılan bir bölümde kalındıysa yeni kampanya ilk bölümden açılır; uygun tamamlanma işaretleri korunur. Eski kayıt anahtarı silinmez. Tarayıcıdaki kayıt kendiliğinden yeni APK'ya taşınmaz.

## Çalıştırma ve doğrulama

```sh
npm test
npm run build
npm run serve
# http://localhost:8080/renk-duragi-0.7.0.html
```

Motor ve HTML derlemesi dış paket gerektirmez. Tarayıcı testleri için Playwright ve Chromium gerekir:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:android
npm run test:scene
npm run test:experience
npm run test:campaign
RENK_SMOKE=1 npm run test:browser
```

Alternatif Chromium yolu `RENK_CHROMIUM_PATH` ile verilebilir. `?test=1` animasyonları hızlandırır; `?test=1&motion=1` gerçek animasyon hızını korur. Kurallar değişmez.

APK için JDK 17, Android SDK platform 35 ve build-tools 35.0.0 gerekir. Manifest sürümü `package.json` ile aynı tutulmalıdır. PKCS12 anahtarın takma adı `renk`, anahtar ve depo parolası aynı olmalıdır. Parolayı komut satırına veya depoya yazmayın:

```sh
export ANDROID_SDK_ROOT=/path/to/android-sdk
export JAVA_HOME=/path/to/jdk-17
export RENK_KEYSTORE_PATH=/private/renk-release.p12
export RENK_STORE_PASS_FILE=/private/password.txt
npm run build
npm run build:apk
```

| Dosya | İçerik |
| --- | --- |
| `src/engine.js` | Fiziksel engeller, geçişler, kayıt oynatma, çözüm arama |
| `src/levels.js`, `src/routes.js` | Eski 24 bölümün kaynakları |
| `src/campaign.js`, `scripts/generate-campaign.cjs` | 489 yeni sabit düzen ve deterministik üretimi |
| `src/catalog.js`, `src/data.cjs` | 500 bölümün sıralaması, sabit kimlikleri ve karmaşıklık sınırları |
| `src/app.js` | Kuyruk, animasyon, 25 gruplu harita, ses, kayıt ve Android kancaları |
| `android/`, `scripts/build-apk.py` | Çevrimdışı WebView uygulaması ve imzalı APK derlemesi |
| `qa/`, `tests/` | Çözüm kanıtları, zorluk eğrisi, APK raporu ve kontroller |

[Doğrulama](docs/verification.md) · [Tasarım](docs/design.md) · [İnsan denemesi](docs/playtest.md)
