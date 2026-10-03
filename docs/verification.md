# Doğrulama — 0.2.0

3 Ekim 2026, ilk oynanabilir mekanik prototipi.

| Kontrol | Sonuç |
| --- | --- |
| Oyun motoru otomatik testleri | 14/14 başarılı |
| Sekiz bölümün bitirilmesi | 8/8 başarılı, dokunma olaylarıyla Chromium testinde |
| Minimum sefer hedefi | Her bölümde BFS; ayrı, simetri kullanmayan aramayla karşılaştırıldı |
| Tüm erişilebilir bölüm durumları | Yolcu korunumu, dört koltuk sınırı ve çıkışsız durum olmaması doğrulandı |
| Geri alma | Koltuklar, bekleyenler, durak, sefer ve ulaşan yolcu geri yüklendi |
| Sayfa yenileme | Son tamamlanmış seferden devam edildi |
| Hatalı yerel kayıt | Oyun açılabildi; geçersiz bölüm/durum kabul edilmedi |
| Dar/geniş ekran | 320, 360, 390, 430, 1280 piksel genişliklerde yatay taşma yok |
| İpucu | Geçerli sonraki araç vurgulandı |
| Animasyon | Normal hızda ilk sefer tamamlandı; animasyon sırasında ek seçim işlenmedi |
| Tarayıcı hataları | Testte yakalanan JavaScript hatası yok |
| Dış ağ isteği | Oynanabilir dosyanın testinde 0 HTTP(S) isteği |

## Bölüm sonuçları

| Bölüm | En az sefer | Ulaşan yolcu |
| --- | ---: | ---: |
| 1 | 3 | 10 |
| 2 | 5 | 14 |
| 3 | 5 | 15 |
| 4 | 6 | 18 |
| 5 | 7 | 22 |
| 6 | 7 | 23 |
| 7 | 8 | 30 |
| 8 | 10 | 32 |

## Sınırlar

- Test Chromium ile masaüstü çalışma ortamında mobil ekran ve dokunma benzetimiyle yapıldı. Gerçek Android/iOS cihaz, Safari, GPU/batarya performansı ve ekran okuyucu kabul testi yapılmadı.
- Kısa ekranlarda sayfa dikey kayabilir; dokunma alanları küçültülmez.
- Oyuncuların eğlence ve anlaşılabilirlik değerlendirmesi henüz yok. Zorluk sıralaması tasarım varsayımıdır.
- APK üretilmedi. Bu sürüm indirilebilir, tek dosyalık çevrimdışı tarayıcı prototipidir.
- Ekran görüntüleri incelendi; küçük ekranda iniş-biniş metninin araç çizimiyle çakışması giderildi.

Tekrarlama komutları ve kaynaklar README içindedir. Test sonuçları üretim yayını onayı veya kullanıcı kabulü değildir.
