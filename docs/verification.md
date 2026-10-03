# Doğrulama — park sürümü 0.3.0

3 Ekim 2026. Önceki indirme-bindirme oyunundan bağımsız, yeniden yazılan park bulmacası.

| Kontrol | Sonuç |
| --- | --- |
| Motor testleri | 20/20 başarılı |
| Dört yönde fiziksel engel | Bütün bölüm/park edilmiş araç alt kümelerinde bağımsız hücre simülasyonuyla eşleşti |
| Bölüm geçerliliği | 12/12; araç çakışması yok; renk bazında yolcu sayısı = koltuk sayısı |
| Yardımsız çözüm | 12/12; geçerli araç sıraları kaydedildi |
| Yanlış seçimle kilitlenme | 12/12; gerçek, erişilebilir başarısız yollar kaydedildi |
| Yolcu sırası / kapasite | Sıra atlama yok; kısmi araç bekliyor; dolu araç ayrılıyor |
| Zincirleme ayrılış | Tek araç gönderimiyle iki bekleyen aracın ayrılması test edildi |
| Dokunmatik oynama | Chromium mobil ekran benzetiminde 12/12 bölüm tamamlandı |
| Ekranda gerçek kilitlenme | İlk bölümde mavi-sarı-sarı seçimi, dolu durak, ilerleyememe, geri alma ve devam doğrulandı |
| Kayıt ve yeniden yükleme | Tamamlanan hamlelerden durum yeniden oluşturuldu |
| Bozuk kayıt | Geçersiz hamle dizisi kabul edilmedi; temiz bölüm açıldı |
| Ekran genişlikleri | 320, 360, 390, 430 ve 1280 piksel; yatay taşma yok |
| Araç dokunma alanları | Test edilen boyutlarda kısa kenar en az 43 piksel |
| İpucu / kuyruk inceleme | Çözülebilir hamle vurgusu, tüm sırayı görme ve modal kapatma doğrulandı |
| Normal animasyon / hızlı art arda tıklama | Ek hamle işlenmedi; aynı renk yolcular binip dolan araçlar ayrıldı |
| JavaScript hatası / harici HTTP(S) isteği | 0 / 0 |

## Sınırlar

Gerçek Android/iOS cihaz, Safari, pil/GPU performansı ve ekran okuyucu kabul testi yapılmadı. En kısa ekranlarda dikey kaydırma olabilir; araç dokunma alanları okunamayacak kadar küçültülmez. APK henüz üretilmedi. Gerçek oyuncu eğlencesi ve zorluk sırası bu otomatik testlerle kanıtlanamaz.

Rastgele seçim ölçümü, fiziksel olarak geçerli hamleler arasından eşit olasılıkla seçen, yardım kullanmayan bir politikadır. İnsan başarı oranı veya pazarlama metriği değildir. Bölüm çözüm/kilitlenme kanıtları `qa/solutions.json` içinde bulunur.
