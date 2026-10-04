package com.gokhanagingil.renk;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Build;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

/** An offline, permission-free host. No JavaScript bridge or remote content. */
public final class MainActivity extends Activity {
    private WebView game;
    private boolean closing;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(224,229,223));
        setContentView(root);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(safe.left,safe.top,safe.right,safe.bottom);
                return insets;
            });
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        }
        try {
            game = new WebView(this);
            game.setBackgroundColor(Color.rgb(224,229,223));
            WebView.setWebContentsDebuggingEnabled(false);
            WebSettings settings = game.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setAllowFileAccess(false);
            settings.setAllowContentAccess(false);
            settings.setBlockNetworkLoads(true);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
            settings.setJavaScriptCanOpenWindowsAutomatically(false);
            settings.setSupportMultipleWindows(false);
            settings.setMediaPlaybackRequiresUserGesture(true);
            game.setWebViewClient(new WebViewClient() {
                @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) { return true; }
                @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest request) {
                    return new WebResourceResponse("text/plain","UTF-8",403,"Offline",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));
                }
                @Override public void onPageFinished(WebView v, String url) {
                    v.evaluateJavascript("window.ParkingNative && window.ParkingNative.resume()",null);
                }
            });
            root.addView(game,new FrameLayout.LayoutParams(-1,-1));
            String html;
            try (InputStream input=getAssets().open("game.html"); ByteArrayOutputStream output=new ByteArrayOutputStream()) {
                byte[] buffer=new byte[16384]; int n; while((n=input.read(buffer))!=-1) output.write(buffer,0,n);
                html=output.toString(StandardCharsets.UTF_8.name());
            }
            // Stable HTTPS origin retains localStorage across app updates. All bytes
            // are supplied directly; the app has no INTERNET permission.
            game.loadDataWithBaseURL("https://renk.invalid/",html,"text/html","UTF-8",null);
        } catch (Exception error) {
            root.removeAllViews();TextView message=new TextView(this);message.setText("Oyun açılamadı. Android System WebView uygulamasını güncelleyip yeniden deneyebilirsin.");message.setTextSize(18);message.setPadding(32,48,32,32);root.addView(message);
        }
    }
    @Override protected void onPause() {
        if(game!=null){game.evaluateJavascript("window.ParkingNative && window.ParkingNative.pause()",null);game.onPause();}
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();if(game!=null){game.onResume();game.evaluateJavascript("window.ParkingNative && window.ParkingNative.resume()",null);}
    }
    @Override public void onBackPressed() {
        if(game==null){super.onBackPressed();return;}
        game.evaluateJavascript("window.ParkingNative ? window.ParkingNative.back() : false",handled->{
            if("true".equals(handled)||closing||isFinishing())return;
            closing=true;new AlertDialog.Builder(this).setTitle("Oyundan çıkılsın mı?").setMessage("İlerlemen otomatik kaydedildi.").setPositiveButton("Çık",(d,w)->finish()).setNegativeButton("Devam et",null).setOnDismissListener(d->closing=false).show();
        });
    }
    @Override protected void onDestroy() {
        if(game!=null){game.stopLoading();game.destroy();game=null;}super.onDestroy();
    }
}
