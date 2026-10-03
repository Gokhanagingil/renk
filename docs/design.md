# 0.4.1 — ekrana sığan şehir otoparkı

4 Ekim 2026, İstanbul. Kullanıcının 0.3 geri bildirimi uygulandı: daha farklı görsel dil, doğal hareket, işlem sırasında açık kontroller, uzun bölümler, gerçek otopark işaretleri, hareketli yolcular ve görünür koltuklar.

## Mekanik korunuyor

Fiziksel çıkış engelleri + üç peron + FIFO renk eşleştirmesi. Çıkabilen her aracı göndermek doğru değildir. İlk bölümde mavi, sarı, sarı gönderimi kırmızıyı dışarıda bırakarak durağı kilitler. Geri alma ücretsizdir. Yeni ceza, sayaç, bilet, VIP veya para mekaniği yoktur.

## Görsel ve etkileşim

Önceki krem/yeşil görünüm yerine lacivert şehir arayüzü, beyaz paneller, kobalt kontroller ve canlı araçlar. Asfalt, numaralı park cepleri, çıkış okları, çevre şeridi, yaya geçidi ve bariyer alanı tanımlar. Araçlar üstü açık; boş koltuk açık renk, dolu koltukta yolcu başı ve gövdesi görünür.

Otopark 8×8 ile 9×10 arasında kompakt düzenlerden oluşur. Varsayılan oynanabilir görünüm, parkın bütününü kalan ekran yüksekliğine sığdırır. Araçların boyutu ekran ve bölüm boyutuna göre değişir. Yakınlaştır düğmesi en az 44 piksel dokunma alanı verir; yatay/dikey kaydırma açılır. Tüm park düğmesi tek dokunuşla sığdırılmış görünüme döner. Ayrı, pasif kuşbakışı penceresi yoktur.

Ekran yüksekliği için 720 piksel eşiği kullanılmaz. `visualViewport` veya `innerHeight` değeri, tarayıcı çubukları açılıp kapanırken de yerleşimi günceller. Parka açık piksel genişlik/yükseklik atanır. Çok kısa ekranda tüm park görünümü daha küçük araçlar gösterir; yakınlaştırma kullanılabilir. Yatay telefonda peron/kontroller solda, otopark sağda durur.

Sakin varsayılan hızda park çıkışı yaklaşık 145 piksel/saniye, yaklaşma en az 1,8 saniye, her yolcunun yürüyüp oturması 1,05–1,25 saniye, araç ayrılması 2,4 saniyedir. Parkın uzak ucundaki araç daha uzun yol alır. Normal seçeneği %30 hızlandırır. Hareket azaltma sistem tercihi desteklenir. Gerçek 65+ oyuncuyla bu süreler henüz doğrulanmadı.

## Eşzamanlılık ve doğruluk

`send` boş bir peron ayırır. Araç park sınırını geçene kadar `exiting` listesiyle arkadakileri engeller. `clear` sonrası çıkış hattı açılır; `arrive` sonrası yolcu alabilir. Yaklaşma şeridi sırayla kullanılır, diğer araçların park çıkışı ve yolcu binişi devam eder.

Tek bir yolcu yürütücüsü FIFO sırasını korur. `board` ancak yürüme bitince koltuğu doldurur. Araç dolunca `leaving` olur; `leave` ancak ayrılma animasyonu bitince peronu boşaltır. Aynı renkli araçlarda gönderilme sırası önceliklidir; animasyon süresi kimin yolcu alacağını değiştirmez.

Kontroller animasyon sırasında kapanmaz. Geri alma/yeniden başlatma eski animasyonları iptal eder; kuşak belirteci eski geri çağrıların yeni oyuna yazmasını önler. Geri alma son gönderimden öncesine döner, daha önce gönderilmiş araçların kalan işlemleri anında tamamlanır. Kayıt, ham duruma güvenmek yerine doğrulanan geçiş günlüğünü tekrar oynatır; yeniden yükleme hareket halindeki araçları yerleştirir.

## Android düzeltmesinin sınırı

0.4.0 kısa ekran hatası Chromium benzetiminde yeniden üretildi. Kullanıcının fiziksel cihazı ve HTML açma uygulaması bilinmediği için kuşbakışı düğmesinin o cihazdaki kesin hata nedeni doğrulanmadı. Eski akış kaldırıldı; yeni doğrudan yakınlaştırma dokunma testleriyle doğrulandı. JavaScript çalıştırmayan dosya önizleyicilerinde tarayıcıda açma bilgisi gösterilir.

## Yolcu canlılığı

Nefes alma, hafif sallanma ve el hareketleri sürekli. Yaklaşık 24 saniye sonra bazı yolcular söylenir; 36 saniye sonra bazıları tuvalet ihtiyacını belli eder. Yalnızca DOM/SVG görünümü değişir; motor durumuna, sıraya, koltuklara veya kazanma koşuluna yazmaz. Bunlar rastgele kaybetme sebebi değildir.

## Bölümler

18 sabit düzen; 12–28 araç, 48–120 yolcu, 4/6 koltuk. İlk sekiz bölüm üç renkli, devamı dört renkli. Zorluk araç engellerinden, sıradan ve peron planından gelir.

Her bölümün çözümü ve gerçek kilitlenme yolu derlemede tekrar doğrulanır. 160 eşit olasılıklı geçerli hamle denemesi yalnız rastgele oynamanın garantili zafer olmadığını gözlemek içindir. Bu örneklem kesin olasılık veya insan başarı tahmini değildir. Büyük durum uzayının tamamı taranmış değildir. Bölüm sırası ve süresi insan denemesiyle ayarlanmalıdır.
