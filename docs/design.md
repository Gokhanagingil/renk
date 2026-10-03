# Tasarım kararı — 3 Ekim 2026

## Amaç

Kullanıcı, park sıkışıklığı ve yolcu eşleştirme türünde basit bir oyun istedi; ardından önerinin mevcut oyunlara çok benzemesini sorguladı. Son onaylanan deneme: aynı araç farklı duraklarda yolcu indirsin, boşalan koltuklara yeni yolcular binsin. Hedef, doğru renge tıklamak yerine koltukların nerede boşalacağını düşünmektir.

## İlk deney

- Sahil ve Park olmak üzere iki hedef; hedeflerin sabit simgesi ve destekleyici rengi.
- Her araçta dört görünür koltuk. İlerleyen bölümlerde renk sayısı artırılmaz.
- Tek etkileşim: bir minibüse dokunmak. Servis, iniş, biniş ve sonraki durağa geçiş otomatik.
- Sefer başında ilgili hedefte inecek yolcular çıkar, sonra boş kapasite kadar bekleyenler biner.
- Bir durağın bekleyenleri diğer durağa gitmek ister. İki kuyruk sabittir; yeniden denemede değişmez.
- İş kalmayan durak ücretsiz atlanır. Araç dolmadan da ayrılır.
- Araç kartı, hamle sonucundaki inecek/binecek kişi sayısını gösterir. İlk deneme anlaşılabilirliği ölçer; bu yardımın ileri seviyelerde isteğe bağlı hale gelmesi test edilebilir.

Bu, şehir simülasyonu değildir: tüm filonun sefer sırası ortak aktif durakla temsil edilir. Gerçek zamanlı araç konumları izlenmez. Bu soyutlamanın anlaşılabilirliği oyuncu testinde özellikle sorulmalıdır.

## Kazanma ve zorluk

Bütün yolcular hedeflerine ulaştığında bölüm tamamlanır. Her geçerli hareket kalan işi azaltır: araçtakiler bir, durakta bekleyenler iki birim iş sayılır. Hiçbir geçerli hamle yolcuyu kaybettirmez; çıkışsız kaybetme durumları yoktur.

Zorluk verimlilikten gelir: üç yıldız en az sefer, iki yıldız en az seferin en fazla iki fazlası, bir yıldız diğer tamamlamalar. İpucu veya geri alma yıldız cezası vermez. Amaç önce temel kararın keyfini denemektir; zorunlu başarı duvarı kurmak değildir.

İlk üç bölümde iki araç, sonraki üçte üç araç, son ikide dört araç bulunur. Kuyruk talebi ve araçtaki karışık yolcu dağılımı kademeli değişir. Bu sıra tasarım varsayımıdır; gerçek insan testinden geçmiş bir zorluk eğrisi olarak sunulmamalıdır.

## Önceki taslaktan değişenler

İki yolcu kuyruğu arasında “makas”, beş renge çıkan bölüm üreticisi ve park çıkış geometrisi önceki, kabul edilmeyen yaklaşımın parçalarıdır. Bu repo bu taslağı içermez. Üç durak slotu ve karmaşık park engelleri yeni mekaniğin ilk testinde ek yük yaratmamak için bekletilmiştir.

## Sonraki karar kapısı

Önce 3–5 kişinin yardımsız ilk iki bölümü denemesi. Temel soru: oyuncu “Sahilde kim iner?” ilişkisini anlayıp ikinci seçiminde kullanıyor mu? Eğer yalnızca alttaki sayıya bakıp otomatik tıklıyorsa görsel anlatım ve karar derinliği yeniden çalışılmalı.

Olumlu geri bildirimden sonra Android paketi, cihaz testleri ve sınırlı park engelleri değerlendirilecek. Mağaza yayınlama, reklam/ödeme sistemi, hesap ve çevrimiçi hizmetler bu sürümün kapsamı dışındadır.
