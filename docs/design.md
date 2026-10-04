# 0.7 — uzun ve sınırlı zorlukta kampanya

## Güncel kampanya kararları

500 bölüm; 25 adet 20 bölümlük grup. 0.6'nın mekaniği, kuyruk okunurluğu, üç hız ve canlı sahnesi korunur. Üst sınır 28 araç / 120 yolcu / 4 renk / 5 araçlık fiziksel engel zinciridir. Her çözüm tanığı en fazla iki peronla tamamlanır. Üçüncü peron oyuncuya manevra payı bırakır; yanlış hamle yine kilitlenebilir, ücretsiz geri alma bulunur.

Öğretici ilk bölümden sonra araç sayısı, engellenen araçlar, zincir uzunluğu, doğrudan engel sayısı, uzun araçlar, renk sayısı ve kuyruk renk değişimleri puanlanarak sıralanır. İlk uzun araç 30., ilk dördüncü renk 154. bölümde gelir. Puan insan zorluğunu ölçmez; ani yapısal artışları azaltan bir tasarım aracıdır. İnsan denemesinde sapmalar görüldüğünde sabit kimlikler sayesinde sıralama kayıtları karıştırmadan değiştirilebilir.

13 eski bölüm aşırı uzun engel zinciri veya uzun araç yoğunluğu nedeniyle aktif listeden çıkarıldı. Kalan 11 bölüme 489 yeni ve geometrik olarak tekil düzen eklendi. Kaynaklardaki üretim sırası oyun sırası değildir; `catalog.js` son sıralamayı oluşturur. Eski dosyalar ve kayıt anahtarı silinmez; aktif kalan eski bölüm kayıtları kimlikle taşınır. Aktif olmayan bölümdeki kayıt yeni kampanyanın başlangıcına yönlendirilir. Tarayıcıdan APK'ya kayıt aktarımı eklenmedi.

Android uygulaması oyunu tek gömülü HTML olarak açar. Ağ izni ve JavaScript köprüsü yoktur. Sabit yerel WebView kaydı, arka planda duraklatma ve geri tuşuyla pencere kapatma vardır. Gerçek cihaz testi ayrıca gereklidir.

## Önceki 0.6 tasarım kaydı

Aşağıdaki bölüm sayıları, sıralama ve kayıt uyumluluğu notları 0.6'nın tarihsel kaydıdır; güncel kampanya için yukarıdaki kararlar geçerlidir.

4 Ekim 2026, İstanbul. Kullanıcının 0.3 geri bildirimi uygulandı: daha farklı görsel dil, doğal hareket, işlem sırasında açık kontroller, uzun bölümler, gerçek otopark işaretleri, hareketli yolcular ve görünür koltuklar.

## Mekanik korunuyor

Fiziksel çıkış engelleri + üç peron + FIFO renk eşleştirmesi. Çıkabilen her aracı göndermek doğru değildir. İlk bölümde mavi, sarı, sarı gönderimi kırmızıyı dışarıda bırakarak durağı kilitler. Geri alma ücretsizdir. Yeni ceza, sayaç, bilet, VIP veya para mekaniği yoktur.

## Görsel ve etkileşim

Kullanıcının paylaştığı referans, kalabalık kuyruğun ve trafik sıkışıklığının tek sahnede anlaşılmasını hedefliyor. 0.5'te panel sınırları azaltıldı; nötr gri meydan/otopark, kıvrımlı kuyruk korkulukları, kaldırım ve küçük çevre öğeleri kullanıldı. Araç ve yolcu renkleri sahnenin dikkat odağıdır.

Parktaki araçların kapalı gövdesinde gölge/ışık katmanları, camlar ve büyük yön oku bulunur. Perona gelen araç açık kabinle gösterilir, yolcular oturdukça koltuklar dolar. Bu görünüm SVG tabanlı hacim etkisidir; gerçek 3D perspektif veya serbest çapraz sürüş eklenmedi. Fiziksel yönler N/E/S/W olarak korunur.

0.5.2: Altı kartlık görünüm okunurluğu artırsa da kalabalık durak hissini kaybettirdi. Bunun yerine tek kişi genişliğinde kıvrımlı kuyruk kullanılır. Yolcular aralarında boşlukla, iki veya üç hatta, en fazla 36 kişi olarak yerleşir. Hatlar birbirini örtmez. Biniş sol alttan başlar; numaralar ve dönüş okları sırayı açıklar. Sıra ve renkler doğrudan motor durumundan gelir. Tüm sıra penceresi numaralı bir ızgaradır. Bekleme hareketleri korunur; konuşma balonları her üç güncellemeden birinde en fazla bir kişide görünür. İlk altı yolcu ve tüm sıra penceresi balon göstermez. Ekran boyutu değiştiğinde kuyruk yeniden yerleşir; yürüyen yolcu tekrar kuyrukta görünmez.

Otopark 8×8 ile 9×10 arasında kompakt düzenlerden oluşur. Varsayılan oynanabilir görünüm, parkın bütününü kalan ekran yüksekliğine sığdırır. Araçların boyutu ekran ve bölüm boyutuna göre değişir. Yakınlaştır düğmesi en az 44 piksel dokunma alanı verir; yatay/dikey kaydırma açılır. Tüm park düğmesi tek dokunuşla sığdırılmış görünüme döner. Ayrı, pasif kuşbakışı penceresi yoktur.

Ekran yüksekliği için 720 piksel eşiği kullanılmaz. `visualViewport` veya `innerHeight` değeri, tarayıcı çubukları açılıp kapanırken de yerleşimi günceller. Parka açık piksel genişlik/yükseklik atanır. Çok kısa ekranda tüm park görünümü daha küçük araçlar gösterir; yakınlaştırma kullanılabilir. Yatay telefonda peron/kontroller solda, otopark sağda durur.

Sakin varsayılan hızdır. Çıkış mesafesi yaklaşık 125 piksel/saniye baz alınarak hızlanma eğrisiyle oynatılır. Perona yaklaşma en az 1,8 saniye; kapıya yürüyüş 1,05–1,37 saniye, koltuğa geçiş 0,33 saniye, kuyruk ilerlemesi 0,62 saniyedir. Tam doluluk işareti 0,65 saniye, ayrılma 2,4 saniyedir. Normal 1,3×, Hızlı 2× çalışır; devam eden bütün hareket animasyonları da hız değişimini alır. Bu süreler 65+ oyuncuyla henüz doğrulanmadı.

## Eşzamanlılık ve doğruluk

`send` boş bir peron ayırır. Araç park sınırını geçene kadar `exiting` listesiyle arkadakileri engeller. `clear` sonrası çıkış hattı açılır; `arrive` sonrası yolcu alabilir. Yaklaşma şeridi sırayla kullanılır, diğer araçların park çıkışı ve yolcu binişi devam eder.

Tek bir yolcu yürütücüsü FIFO sırasını korur. `board` ancak yürüme bitince koltuğu doldurur. Araç dolunca `leaving` olur; `leave` ancak ayrılma animasyonu bitince peronu boşaltır. Aynı renkli araçlarda gönderilme sırası önceliklidir; animasyon süresi kimin yolcu alacağını değiştirmez.

Kontroller animasyon sırasında kapanmaz. Geri alma/yeniden başlatma eski animasyonları iptal eder; kuşak belirteci eski geri çağrıların yeni oyuna yazmasını önler. Geri alma son gönderimden öncesine döner, daha önce gönderilmiş araçların kalan işlemleri anında tamamlanır. Kayıt, ham duruma güvenmek yerine doğrulanan geçiş günlüğünü tekrar oynatır; yeniden yükleme hareket halindeki araçları yerleştirir.

## Android düzeltmesinin sınırı

0.4.0 kısa ekran hatası Chromium benzetiminde yeniden üretildi. Kullanıcının fiziksel cihazı ve HTML açma uygulaması bilinmediği için kuşbakışı düğmesinin o cihazdaki kesin hata nedeni doğrulanmadı. Eski akış kaldırıldı; yeni doğrudan yakınlaştırma dokunma testleriyle doğrulandı. JavaScript çalıştırmayan dosya önizleyicilerinde tarayıcıda açma bilgisi gösterilir.

## Yolcu canlılığı

Nefes alma, hafif sallanma ve el hareketleri sürekli. Yaklaşık 24 saniye sonra bazı yolcular söylenir; 36 saniye sonra bazıları tuvalet ihtiyacını belli eder. Yalnızca DOM/SVG görünümü değişir; motor durumuna, sıraya, koltuklara veya kazanma koşuluna yazmaz. Bunlar rastgele kaybetme sebebi değildir.

## Bölümler

18 ana bölüm + 6 özel rota; 12–28 araç, 48–120 yolcu, 4/6 koltuk. İlk sekiz bölüm üç renkli, devamı dört renkli. Zorluk araç engellerinden, sıradan ve peron planından gelir.

Her bölümün çözümü ve gerçek kilitlenme yolu derlemede tekrar doğrulanır. 160 eşit olasılıklı geçerli hamle denemesi yalnız rastgele oynamanın garantili zafer olmadığını gözlemek içindir. Bu örneklem kesin olasılık veya insan başarı tahmini değildir. Büyük durum uzayının tamamı taranmış değildir. Bölüm sırası ve süresi insan denemesiyle ayarlanmalıdır.

## 0.6 deneyim kararları

Kuyruk ilerleyişi motor durumunu değiştirmez; yalnızca `board` geçişi sırayı tüketir. Görünen kişiler bölüm ve kimlik üzerinden yeniden kullanılır. Dönüşteki kişiler korkuluk kıvrımını izleyen iki quadratic eğriden örneklenen ara noktalardan geçer. Kuyruk animasyonu tamamlanınca sonraki kişi kapıya yürür. Bu sırada başka araçlar gönderilebilir.

Yeni bölgeler: mahalle (1–4), sahil (5–8), pazar (9–12), festival (13–15), havaalanı (16–18). Yeni kurallar veya harcama sistemi yoktur. Tamamlanan duraklar haritada işaretlenir; test için bütün duraklar açıktır. Renk tonu ve küçük çevre çizimleri değişir; oyun hedefleri aynı boyutta kalır.

Özel rotalar 19–24, açıkça tanımlanmış zincir ve dört yönlü çıkış geometrileriyle yazıldı. Bazıları aynı geometrinin dönmüş varyantıdır; kapasite ve yolcu dizileri farklı planlama deneyimleri sunar. Koltuk hesabı / Son bağlantı 4 ve 6 koltuklu araçları birlikte kullanır. Sahil molası daha az iç içe geçen renk gruplarıyla bir nefes arası hedefler. Gerçek insan zorluğu henüz ölçülmedi.

Araç dolunca son yolcu el sallar ve kısa bir doluluk işareti görünür. Kazanma ekranı parkı karartmaz; ilerleme düğmesi boş parkın üzerinde küçük bir alan olarak gösterilir. Kedi, telefon ve esneme davranışları görseldir. Sesler yerel Web Audio senteziyle üretilir, kapalı başlayıp isteğe bağlı açılır. Harici ses veya görsel indirilmez.

İlk 18 bölümün kuralları, geometrisi ve yolcu sıraları korunur. Kayıt anahtarı değişmedi; eklenen rotalar mevcut kayda uyumlu biçimde sona eklenir. Daha kapsamlı 3D sanat, özgün müzik, otomatik zorluk uyarlaması ve yeni bariyer mekanikleri bu sürümde yoktur.
