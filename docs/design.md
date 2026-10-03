# Park bulmacası — yeni başlangıç

## Kabul edilen temel

Kullanıcı önceki 0.2 indirme-bindirme prototipini reddetti: trafik/otopark engelleri yoktu ve bütün geçerli seçimler sonunda tamamlanmaya gidiyordu. 3 Ekim 2026 tarihli yeni onay, özgünlük adına temel oyundan uzaklaşmadan klasik park çıkışı + yolcu eşleştirmesine dönmektir.

0.2 sürümü arşiv dalında korunur. 0.3 motoru, arayüzü, bölüm modeli ve testleri yeni kurallar için yeniden yazıldı.

## Birbirine bağlı üç karar

1. İstenen aracın çıkış hattı açık mı?
2. Önündeki aracı çıkarırsam durakta kaç boş yer kalır?
3. Kuyruğun başındaki yolcular hangi araçları doldurup bu yerleri boşaltabilir?

Araç tek tıkla ok yönünde hareket eder. Park sınırına kadar önündeki bütün hücreler boş olmalıdır. Araç park dışındaki servis yolundan durağa gider; oyuncu sürüş veya rota çizmez.

Durakta üç sabit yer vardır. Yolcular FIFO sırasındadır. Aynı renk birden fazla araç varsa soldaki uygun araca binerler. Araç dolmadan ayrılmaz. Tek gönderme, birden fazla bekleyen aracı doldurup zincirleme ayrılışa yol açabilir.

## Hatanın sonucu

Üç yer dolu ve ilk yolcuya uygun araç bulunmuyorsa yeni araç getirilemez. Tahta ekranda kalır; durak ve geri alma kontrolü uyarıyla vurgulanır. Oyun kendiliğinden araç boşaltmaz, sıra değiştirmez veya oyuncuya ek yer vermez. Yardımcı kullanımı veya reklam gerektirmeden geri alarak yeni sıra denenebilir.

İlk bölümde mavi araç kırmızının yolunu kapatır. Mavi, sarı, sarı sırası üç durak yerini doldurur; kırmızı araç çıkabilecek hale gelse bile durağa gelemez. Mavi, kırmızı, sarı, sarı sırası çözümdür. Böylece ilk bölümde bile seçim önemlidir.

## Zorluk ve okunabilirlik

- 6×6 park alanı; büyük, yönü belli araçlar.
- Aynı anda en çok dört renk. Her rengin sabit şekli var.
- İlk sekiz bölüm üç renkli; dördüncü renk dokuzuncu bölümde tanıtılır.
- Araç ve fiziksel engel sayısı, yolcu karışımı ve kapasite farklılıkları artırılır.
- “Tüm sıra” ile gelecek yolcular görülebilir; bilgi reklam veya ödeme arkasında saklanmaz.
- İpucu, mevcut durumdan gerçek bir çözüm arar. Çözüm kalmadığında geri alma önerir; rastgele araç parlatmaz.
- Bölüm sırası henüz insanlarla ölçülmüş zorluk eğrisi değildir. Bazı bölümler daha rahat nefes alma aralığı olarak kalabilir.

## Rastgele seçim kontrolünün anlamı

Analiz her durumda fiziksel olarak çıkabilen araçlardan eşit olasılıkla birini seçen, geri alma/ipucu kullanmayan bir politikayı hesaplar. Bu, insan başarısı tahmini değildir; bütün hamlelerin otomatik zafere gidip gitmediğini kontrol eder.

Her bölümün en az bir çözümü ve erişilebilir kilitlenmesi vardır. İlk bölümde bu rastgele politikanın kazanma olasılığı 7/18, yani yaklaşık %38,9’dur. Son bölümde yaklaşık %10,2’dir. Ayrıntılar `qa/solutions.json` içindedir. Rastgele oyuncu şans eseri kazanabilir; rastgele oynamak artık garantili tamamlanma sağlamaz.

## Şimdiki kapsam

Yeni mekanik, VIP, iki durak arasında indirme, hat seçimi, süre baskısı ve puan optimizasyonu eklenmez. Bu sürümün amacı, özgün ilk istekteki sıkışıklık ve sıralama bulmacasını doğru hissettirmektir.
