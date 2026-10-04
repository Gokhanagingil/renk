# 0.5 — tek sahne, canlı kuyruk ve üç hız

4 Ekim 2026, İstanbul. Kullanıcının 0.3 geri bildirimi uygulandı: daha farklı görsel dil, doğal hareket, işlem sırasında açık kontroller, uzun bölümler, gerçek otopark işaretleri, hareketli yolcular ve görünür koltuklar.

## Mekanik korunuyor

Fiziksel çıkış engelleri + üç peron + FIFO renk eşleştirmesi. Çıkabilen her aracı göndermek doğru değildir. İlk bölümde mavi, sarı, sarı gönderimi kırmızıyı dışarıda bırakarak durağı kilitler. Geri alma ücretsizdir. Yeni ceza, sayaç, bilet, VIP veya para mekaniği yoktur.

## Görsel ve etkileşim

Kullanıcının paylaştığı referans, kalabalık kuyruğun ve trafik sıkışıklığının tek sahnede anlaşılmasını hedefliyor. 0.5'te panel sınırları azaltıldı; nötr gri meydan/otopark, kıvrımlı kuyruk korkulukları, kaldırım ve küçük çevre öğeleri kullanıldı. Araç ve yolcu renkleri sahnenin dikkat odağıdır.

Parktaki araçların kapalı gövdesinde gölge/ışık katmanları, camlar ve büyük yön oku bulunur. Perona gelen araç açık kabinle gösterilir, yolcular oturdukça koltuklar dolar. Bu görünüm SVG tabanlı hacim etkisidir; gerçek 3D perspektif veya serbest çapraz sürüş eklenmedi. Fiziksel yönler N/E/S/W olarak korunur.

0.5.2: Altı kartlık görünüm okunurluğu artırsa da kalabalık durak hissini kaybettirdi. Bunun yerine tek kişi genişliğinde kıvrımlı kuyruk kullanılır. Yolcular aralarında boşlukla, iki veya üç hatta, en fazla 36 kişi olarak yerleşir. Hatlar birbirini örtmez. Biniş sol alttan başlar; numaralar ve dönüş okları sırayı açıklar. Sıra ve renkler doğrudan motor durumundan gelir. Tüm sıra penceresi numaralı bir ızgaradır. Bekleme hareketleri korunur; konuşma balonları her üç güncellemeden birinde en fazla bir kişide görünür. İlk altı yolcu ve tüm sıra penceresi balon göstermez. Ekran boyutu değiştiğinde kuyruk yeniden yerleşir; yürüyen yolcu tekrar kuyrukta görünmez.

Otopark 8×8 ile 9×10 arasında kompakt düzenlerden oluşur. Varsayılan oynanabilir görünüm, parkın bütününü kalan ekran yüksekliğine sığdırır. Araçların boyutu ekran ve bölüm boyutuna göre değişir. Yakınlaştır düğmesi en az 44 piksel dokunma alanı verir; yatay/dikey kaydırma açılır. Tüm park düğmesi tek dokunuşla sığdırılmış görünüme döner. Ayrı, pasif kuşbakışı penceresi yoktur.

Ekran yüksekliği için 720 piksel eşiği kullanılmaz. `visualViewport` veya `innerHeight` değeri, tarayıcı çubukları açılıp kapanırken de yerleşimi günceller. Parka açık piksel genişlik/yükseklik atanır. Çok kısa ekranda tüm park görünümü daha küçük araçlar gösterir; yakınlaştırma kullanılabilir. Yatay telefonda peron/kontroller solda, otopark sağda durur.

Sakin varsayılan hızda park çıkışı yaklaşık 145 piksel/saniye, yaklaşma en az 1,8 saniye, her yolcunun yürüyüp oturması 1,05–1,25 saniye, araç ayrılması 2,4 saniyedir. Parkın uzak ucundaki araç daha uzun yol alır. Normal seçeneği %30, Hızlı seçeneği %100 hızlandırır. Hız düğmesi Sakin → Normal → Hızlı → Sakin döngüsündedir. Devam eden Web Animations örneklerinin oynatma oranı da değişir; durum veya FIFO sırası hızdan etkilenmez. Hareket azaltma sistem tercihi desteklenir. Gerçek 65+ oyuncuyla bu süreler henüz doğrulanmadı.

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

## Kapsam sınırı

0.5 görsel ve hız güncellemesidir. 0.4.1 bölüm geometrisi, araç sayısı, renk sınırı ve motor kuralları değişmedi. Yoğun ileri bölümler korunur; ilk öğretici bölüm daha seyrektir. Yeni sürümün estetik beğenisi ve gerçek cihaz akıcılığı kullanıcı denemesiyle değerlendirilmelidir.
