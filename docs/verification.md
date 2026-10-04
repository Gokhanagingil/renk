# Doğrulama — 0.7.0

4 Ekim 2026. APK paket kontrolü ve Chromium mobil benzetimi yapıldı. Fiziksel Android cihaz, Android emülatörü ve 65+ oyuncu kabulü henüz yapılmadı.

## Motor ve kampanya

500 bölümün geçerliliği, kapasite/renk dengesi, çözüm tanığı, canlı geçişlerle eşdeğerlik ve gerçek kilitlenme yolları doğrulandı. 507 motor testine üç kampanya testi eklendi. Bütün kazanma tanıkları en fazla iki peron gerektiriyor. Bu, üçüncü peronun her rastgele hamleyi kurtaracağını değil, çözüm yolunda bir boşluk bırakılabildiğini gösterir.

İlk öğretici bölüm dışında tasarım puanı azalmayan sıradadır; en büyük artış 1,35 puan. 20'şer bölümlük 25 grubun ortalaması yükselir. Altı koltuklu araçlar 30., dördüncü renk 154. bölümde başlar. Üst sınırlar: 28 araç, 120 yolcu, 4 renk, 5 araçlık engel zinciri, 6 uzun araç. Ölçü bir insan zorluğu tahmini veya başarı garantisi değildir.

489 yeni otopark geometrisi döndürme ve yansıtma altında da tekildir. Sınırları aşan 13 eski bölüm aktif kampanyadan çıkarıldı; eski kaynaklar korunur. `qa/campaign-summary.json` üretim kimliklerini, `qa/solutions.json` güncel oynama sırasını, `qa/difficulty-curve.json` sıralama özetini içerir. Rastgele politika örnekleri insan başarı oranı değildir.

## Mobil yerleşim ve deneyim

On ekran boyutunda 1, 100, 250 ve 500. bölümler: 40 görünürlük/dokunma kontrolü. Araçlar parka sığar; merkezlerinden dokunulabilir; yakınlaştırılmış kısa araç kenarı en az 44 piksel. Dinamik ekran yüksekliği, yatay görünüm ve açık piksel geometrisi kontrol edildi.

Ekranlar: 320×480, 320×568, 360×640, 360×720, 393×700, 412×732, 390×844, 430×932, 640×360, 844×390. Bölüm sonu alanı ve devam düğmesi 320×480'de de kontrol edildi.

- İlk bölüm, altı eski özel rota ve kampanyanın 30, 154, 250, 500. bölümleri tarayıcıda araçlara dokunularak tamamlandı. Kalan bölümler motor geçişleriyle doğrulandı; 500'ü elle oynanmadı.
- 25 grup, önceki/sonraki sınırları, 1–500 numara denetimi, son bölümün bitişi ve harita işaretleri test edildi.
- Son bölümde kısmi oyun ve hız yeniden yüklemede korundu. Eski kayıt sırası sabit bölüm kimliğine eşleştirildi. Android için sunulan pause/resume/back JavaScript kancaları tarayıcıda kontrol edildi; bu fiziksel Android yaşam döngüsü testi değildir.
- Yolcu kimliği/renk sırası, kıvrımları takip eden yürüyüş, kapıdan biniş, eşzamanlı araç gönderimi, üç hız, geri alma ve animasyon iptali geçti.
- Beş bölgenin görünümü, ses açma/kapatma, boş park üzerinde bitiş ve kaydedilen tamamlanma işaretleri geçti. Testte harici HTTP(S) isteği ve JavaScript hatası yoktu.

## Android paketi

`qa/apk-report.json`: v2/v3 imzaları geçerli, ZIP hizalaması geçerli, paket `com.gokhanagingil.renk`, minSdk 26, targetSdk 35, izin listesi boş. APK'daki HTML byte düzeyinde dağıtımla aynı. Debug kapalıdır; imza anahtarı/parolası depoya dahil edilmez. APK bir mağaza yayını değildir.

Komutlar: `npm test`, `npm run build`, `npm run test:android`, `npm run test:scene`, `npm run test:experience`, `npm run test:campaign`, `RENK_SMOKE=1 npm run test:browser`, `npm run build:apk`.
