# Doğrulama — Android yerleşim düzeltmesi 0.4.1

4 Ekim 2026, İstanbul. Bunlar Chromium mobil benzetimi sonuçlarıdır; kullanıcının fiziksel Android cihazı erişilebilir değildi.

## Önceki hatanın yeniden üretimi

| Ekran | 0.4.0 otopark başlangıcı | Görünen otopark yüksekliği | Bütünüyle görünen araç |
| --- | ---: | ---: | ---: |
| 320×568 | 533 px | 35 px | 0/12 |
| 360×640 | 545 px | 95 px | 0/12 |
| 393×700 | 545 px | 155 px | 0/12 |

720 piksel altındaki ekranlarda kompakt yerleşim uygulanmıyordu. Eski testler yatay taşmayı ve tek bir uzun ekranda sayfa boyunu ölçüyor, kısa ekranda araçların gerçekten görünmesini ölçmüyordu. Yeni test her aracın görünür alan sınırlarını ve merkez noktasının gerçekten dokunulabilir olmasını kontrol eder.

## Düzeltme kontrolleri

- 25 motor testi: tüm yeni kompakt düzenlerde geçerli çözüm, gerçek kilitlenme, renk/koltuk korunumu ve fiziksel engeller.
- On ekran: 320×480, 320×568, 360×640, 360×720, 393×700, 412×732, 390×844, 430×932, 640×360 ve 844×390.
- Her ekranda hem 12 hem 28 araçlı otopark: bütün araçlar alanın içinde, bütün merkez noktaları dokunulabilir, sayfada taşma yok.
- Yakınlaştır ve Tüm park düğmelerine gerçek dokunma; görünüm değişiyor, modal açılmıyor, oyun durumu korunuyor.
- Yakın görünümde araçların kısa dokunma kenarı en az 44 piksel.
- Sığdırılmış görünümde araca dokunma doğru aracı gönderiyor.
- Ekran yüksekliği 800 → 640 → 720 → 568 → 800 değişirken oyun yeniden sığıyor.
- CSS `aspect-ratio` kapatıldığında park boyutu ve araçlar korunuyor.
- JavaScript hatası yok.

Tarayıcı oyun akışı ayrıca tüm 18 bölümün dokunarak çözülmesini, fiziksel engeli, yanlış sırayla kilitlenmeyi, ipucunu, biniş sırasında araç göndermeyi, hareket sırasında geri almayı/yeniden başlatmayı, kayıt/devamı ve azaltılmış hareketi kontrol eder.

## Sınırlar

Çok kısa ekranda bütün parkı göstermek araçları küçültür; daha rahat dokunmak için yakınlaştırma gerekir. Fiziksel Android/Samsung Internet/WebView, Safari ve 65+ oyuncu denemesi henüz yapılmadı. Kullanıcının eski kuşbakışı düğmesinin cihazındaki kesin arıza nedeni doğrulanmadı; pasif harita akışı kaldırıldı ve yeni iki yönlü kontrol dokunarak test edildi.

Yeni yerleşimler farklı kayıt anahtarı kullanır. Önceki dosya ve kaydı korunur, bölüm içi hamleler yeni düzenlere taşınmaz.

Tekrarlama: `npm test`, `npm run build`, `npm run test:android`, `npm run test:browser`. Çözüm/kilitlenme kanıtları: `qa/solutions.json`.
