# Doğrulama — 0.5.2

4 Ekim 2026, İstanbul. Kullanıcı önceki sürümlerin Android telefonda çalıştığını, 0.5 kuyruğunun okunmasının zor olduğunu, 0.5.1 kartlarının ise eski görünüme döndüğünü bildirdi. 0.5.2 için aşağıdaki kontroller Chromium mobil benzetiminde yapıldı; yeni sürüm henüz fiziksel telefonda denenmedi.

## Kurallar ve yerleşim

- 25 motor testi geçti. Bölümler/motor 0.4.1 ile aynıdır: 18 geçerli çözüm, gerçek kilitlenme yolları, kapasite korunumu ve fiziksel engeller.
- On ekran boyutunda ilk ve son bölüm: 20 görünürlük/dokunma kontrolü geçti. Bütün araçlar ekrana sığıyor, araç merkezleri dokunulabilir, sayfada taşma yok.
- Ekranlar: 320×480, 320×568, 360×640, 360×720, 393×700, 412×732, 390×844, 430×932, 640×360, 844×390.
- Yakınlaştır / Tüm park iki yönde çalışıyor; yakın görünümde kısa dokunma kenarı en az 44 piksel.
- Birinci bölüm dokunarak tamamlandı; engel, kilitlenme, ipucu, biniş sırasında yeni araç, hareket sırasında geri alma/sıfırlama, kayıt ve azaltılmış hareket yeniden doğrulandı. 18 bölümün tamamının tarayıcı çözümü önceki 0.4.1 sürümünde yapılmıştı; bu sürümde motor/bölüm değişmediği için aynı kapsam tekrar edilmedi.

## Yolcu sırası ve hız kontrolleri

- Kıvrımlı kuyrukta insanların çakışmadan yerleşmesi, devam eden sıra numaraları ve tüm sıra penceresindeki 120 numara doğrulandı. 8. bölümün görünümü de incelendi.
- Uzun beklemelerde en fazla bir balon, ilk yolcuda ve tüm sıra penceresinde sıfır balon; motor durumuna etkisizlik doğrulandı.

- Görünür kalabalıktaki yolcuların kimliği/rengi, motor kuyruğuyla birebir karşılaştırıldı. Binişten ve yeniden yüklemeden sonra sıra korunuyor.
- Park araçlarında büyük ok ve kapalı tavan; perondaki araçta açık kabin ve doğru sayıda koltuk doğrulandı.
- Ekran boyutu değişince kuyruk tekrar yerleşiyor; yürüyen yolcu ikinci kez görünmüyor. Küçük ekranlarda yolcular sahne sınırları içinde; Tüm sıra düğmesinin merkezi gerçek dokunma hedefi olarak kontrol edildi.
- Sakin → Normal → Hızlı → Sakin döngüsü 1 / 1,3 / 2 / 1 değerleriyle çalışıyor; durgun oyunun motor durumu değişmiyor.
- Normal animasyon sırasında araç oynatma oranı 1 → 1,3 → 2 olarak değişiyor.
- Hızlı tercih yeniden yüklemede korunuyor; sonraki yolcu binişi 2× başlıyor. Biniş sürerken Sakin seçildiğinde devam eden animasyon 1× oluyor.
- JavaScript hatası ve oyun testinde harici HTTP(S) isteği yok.

## Sınırlar

Gerçek 3D motor, çapraz sürüş veya ek araç/renk eklenmedi. Görsel hacim SVG katmanları ve gölgelerle sağlanır. Ana ekranda en fazla 36 kuyruk yolcusu çizilir; tamamı sıra penceresinde görülebilir. Çok kısa ekranda araçlar küçülür; yakınlaştırma desteklenir. Fiziksel Android/Samsung Internet/WebView, pil/ısınma ve 65+ oyuncu kabul testi bekliyor.

Komutlar: `npm test`, `npm run build`, `npm run test:android`, `npm run test:scene`, `RENK_SMOKE=1 npm run test:browser`.
