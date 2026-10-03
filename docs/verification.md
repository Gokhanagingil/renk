# Doğrulama — 0.4.0

4 Ekim 2026, İstanbul. Gerçek cihaz/65+ oyuncu denemesi değil; otomatik motor ve Chromium mobil benzetimi sonuçlarıdır.

| Kontrol | Sonuç |
| --- | --- |
| Motor | 25/25 test geçti |
| Bölüm geçerliliği | 18/18; çakışma yok, renk bazında koltuk ve yolcu sayısı eşit |
| Yardımsız çözümler | 18/18; hem anlık çözüm modelinde hem canlı geçişlerde tamamlandı |
| Gerçek başarısızlık yolu | 18/18; üç peronla kilitlenme mümkün |
| Bağımsız çarpışma kontrolü | Her bölümde tam düzen + 69 araç alt kümesi, dört yönde süpürülen hücrelerle eşleşti |
| Dokunmatik tarayıcı | 18/18 bölüm araç düğmelerine dokunarak tamamlandı |
| Eşzamanlı gönderim | Üç araç art arda kabul edildi; kopya dokunma ve dördüncü rezervasyon reddedildi |
| Hareket sırasında park | Diğer araç düğmeleri etkin, opaklık 1; otomatik karartma/modal yok |
| Biniş sırasında gönderim | Birinci yolcu bindikten sonra yeni araç kabul edildi; önceki biniş sürdü |
| Fiziksel peron rezervasyonu | Araç yoldayken yer ayrıldı; dolan araç ayrılmadan yer boşalmadı |
| FIFO / öncelik | Öndeki yolcu atlanmadı; aynı renkli araçlarda gönderim sırası korundu |
| Geri alma / yeniden başlama | Normal animasyon sırasında iptal; eski geri çağrılar yeni durumu değiştirmedi |
| Kayıt / devam | Hareket halindeki kayıt doğrulanıp güvenli bekleme durumuna getirildi |
| Bozuk kayıt | Geçersiz geçişler kabul edilmedi; temiz bölüm açıldı |
| Yolcu davranışı | Söylenme ve WC görünümleri oluştu; motor durumu değişmedi |
| Ekranlar | 320×568, 360×740, 390×844, 430×932, 1280×844; yatay taşma yok |
| Dokunma | Araçların kısa kenarı tüm test boyutlarında en az 44 piksel |
| Telefon yerleşimi | 390×844'te sıra, peron, park ve kontroller aynı ekrana sığdı |
| Yardım / inceleme | İpucu, 120 kişilik sıra ve 28 araçlık kuşbakışı harita açıldı |
| Hareket azaltma | Sistem tercihiyle animasyonlar kısaldı; kurallar aynı kaldı |
| JavaScript hatası / harici HTTP(S) isteği | 0 / 0 |

Son boyut ve animasyon hizası düzeltmesinden sonra ilk bölüm, beş ekran boyutu ve eşzamanlılık/kayıt/iptal akışı ayrıca tekrar kontrol edildi. Motorun 25 testi de son kaynak üzerinde tekrar geçti.

## Sınırlar

- Gerçek 65+ kullanıcı, fiziksel Android/iOS cihaz, Safari ve ekran okuyucu kabul testi yapılmadı.
- Küçük yükseklikteki ekranlarda sayfa da kayabilir; araçlar bu nedenle küçültülmez.
- Otopark büyük olduğu için tamamı aynı anda görünmez. Kuşbakışı harita ve kaydırma davranışı insan denemesinde özellikle izlenmelidir.
- 18 bölümün oynanabilirliği doğrulandı; eğlencesi, doğal zorluk sırası ve sürelerinin uygunluğu insanlarla ölçülmedi.
- Rastgele oyun sonuçları 160 denemelik örneklemdir; kesin olasılık değildir. Bütün büyük durum uzayı taranmamıştır.
- APK veya mağaza yayını yapılmadı. Dosya çevrimdışı tarayıcı prototipidir.

Tekrarlama: `npm test`, `npm run build`, `npm run test:browser`. Hızlı son kontrol için `RENK_SMOKE=1 npm run test:browser`. Bölüm çözüm/kilitlenme yolları `qa/solutions.json` içinde.
