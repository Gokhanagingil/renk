# Doğrulama — 0.6.0

4 Ekim 2026, İstanbul. Kontroller Chromium mobil benzetiminde yapıldı. Önceki sürümler fiziksel Android telefonda kullanıcı tarafından denendi; bu sürüm için henüz fiziksel cihaz ve 65+ oyuncu kabulü yoktur.

## Motor ve bölümler

31 motor testi geçti. 24 bölümün geçerliliği, kapasite/renk dengesi, çözüm tanığı, canlı geçişlerle eşdeğerlik ve gerçek kilitlenme yolları doğrulandı. İlk 18 bölümün geometrisi ve kuyrukları değişmedi; adlar şehir bölgelerine uyarlandı. Altı özel rota eklendi.

Birinci bölüm genel tarayıcı akışında, altı yeni rota deneyim testinde dokunarak tamamlandı. Diğer 17 eski bölüm bu sürümde tekrar baştan sona tarayıcıda oynanmadı; motor tanıkları bütün 24 bölüm için çalıştırıldı.

## Mobil yerleşim

On ekran boyutunda dört bölüm (1, 18, 21, 24): 40 görünürlük/dokunma kontrolü geçti. Bütün araçlar görünür; merkezlerinden dokunulabilir; sayfa taşmıyor; yakınlaştırılmış kısa araç kenarı en az 44 piksel. Dinamik ekran yüksekliği ve CSS aspect-ratio desteği olmadan açık piksel geometrisi kontrol edildi.

Ekranlar: 320×480, 320×568, 360×640, 360×720, 393×700, 412×732, 390×844, 430×932, 640×360, 844×390. Bölüm sonu alanının 320×480 ekrana sığması ve devam düğmesinin dokunulabilirliği ayrıca kontrol edildi.

## Canlı deneyim

- Görünür yolcu kimlikleri/renkleri motor kuyruğuyla aynı. Bölüm değişiminde eski DOM kişilerinin yanlış renkleri koruması testte yakalandı ve düzeltildi.
- Kuyruk ilerlerken aynı kişinin DOM kimliği korunuyor. Dönüş animasyonu korkuluğu takip eden ara noktaları içeriyor.
- İlk yolcu öne ulaşmadan ikinci biniş başlamıyor. Araç göndermek, hız değiştirmek ve geri almak açık kalıyor.
- Sakin / Normal / Hızlı, devam eden araç, biniş ve kuyruk animasyonlarına uygulanıyor. Hız tercihi yeniden yüklemede korunuyor.
- Ekran boyutu değişirken yürüyen yolcu ikinci kez kuyrukta gösterilmiyor. Geri alma/sıfırlama eski animasyonların duruma yazmasını önlüyor.
- Açılan yol geri bildirimi ancak araç fiziksel engel alanını terk ettikten sonra gösteriliyor.
- Beş bölge adı ve farklı zemin rengi; haritada 18 ana bölüm ve altı özel rota; yeni rota seçimi doğrulandı.
- Bölüm sonunda modal/dimleme yok; boş park ve devam alanı görünür. Sonuç, yeniden yükleme ve harita tamamlanma işaretleri korunuyor.
- Ses açıldığında kaynaklar başlıyor, kapatıldığında duruyor. Sesin öznel kalitesi ve telefon hoparlöründeki seviyesi henüz dinleyerek doğrulanmadı.
- JavaScript hatası ve oyun tarafından yapılan harici HTTP(S) isteği yok.

Komutlar: `npm test`, `npm run build`, `npm run test:android`, `npm run test:scene`, `npm run test:experience`, `RENK_SMOKE=1 npm run test:browser`.
