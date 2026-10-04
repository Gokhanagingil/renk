# Renk Durağı — 0.6.0

**Yolu aç, peronda yer bırak, yolcuları koltuklarına yerleştir.**

[Oynanabilir tek dosya: renk-duragi-0.6.0.html](dist/renk-duragi-0.6.0.html). İndirip tarayıcıda aç. İnternet, hesap ve harici dosya gerekmez. GitHub dosya görüntüleyicisi oyunu çalıştırmaz.

## Yeni deneyim

- **Yürüyen kuyruk:** Yolcular yerlerine ışınlanmaz; aynı kişiler korkuluk boyunca ilerler. Dönüşleri izler, adım atar ve baştaki kişi öne ulaşınca biniş başlar. Ekrana göre 2–3 hatta en fazla 36 yolcu görünür.
- **Kapıdan koltuğa:** Yolcu yaya yolunu takip eder, kapıdan geçer, boş koltuğuna oturur. Araç dolunca kısa bir hazır işareti ve el sallama görünür.
- **Doğal sürüş:** Araç hızlanır, dönüşte yavaşlar ve perona yaklaşırken frenler. Diğer araçları göndermek için animasyonların bitmesi gerekmez.
- **Açılan yol:** Engellenen araç ok yönünde küçük bir hareketle durur. Engel gerçekten kalkınca yolu açılan araçların konumu kısa süreli vurgulanır.
- **Beş bölge:** Mahalle, sahil, pazar, festival, havaalanı. Zemin tonları, küçük çevre çizimleri ve şehir haritası değişir. Tamamlanan duraklar kaydedilir. Bütün duraklar denemeye açıktır.
- **Altı özel rota:** Koridor açma, farklı çıkış yönleri, 4/6 koltuk kapasitesi ve peronda yer ayırma üzerine düzenlenmiş 19–24. bölümler. Önceki 18 bölümün geometrisi ve kuyrukları korunur.
- **Boşalan park:** Bölüm sonu ekranı karartmaz. Boş otopark görünür kalır; küçük bir devam alanı ve kısa kutlama çıkar.
- **Küçük canlılıklar:** Telefonuna bakan ve esneyen yolcular, el sallama, kıpırdanma ve duraktaki kedi. Bekleme cezası yoktur. İlk altı yolcuda konuşma balonu yok; diğerlerinde aralıklı olarak en fazla bir balon.
- **İsteğe bağlı ses:** Motor, varış, koltuğa oturma, dolu araç ve tamamlanma için düşük sesli kısa efektler. Harici ses dosyası yoktur. Ses kapatma devam eden notaları da durdurur.

## Oyun

24 sabit bölüm; 12–28 araç, 48–120 yolcu. İlk sekiz ana bölüm üç renkli, sonrakiler dört renkli; özel rotalar üç renklidir. Renkler şekillerle de belirtilir. Süre sınırı, reklam, ödeme ve can sistemi yoktur.

1. Araca dokun. Önündeki hat park sınırına kadar açıksa ok yönünde çıkar.
2. Durağın üç yeri vardır. Yola çıkan araç hemen bir yer ayırır; ayrılana kadar o yer doludur.
3. Yolcular sırayla kendi renklerindeki araca biner. Aynı renkteki araçlardan önce gönderilen önceliklidir.
4. Dolan araç perondan çıkınca yer boşalır. Kısmen dolu araç bekler.
5. Üç yeri yanlış renklerle doldurmak kilitlenmeye yol açar. Ücretsiz geri al veya yeniden dene.
6. Bütün yolcular binip araçlar ayrıldığında bölüm biter.

Sakin (1×), Normal (1,3×), Hızlı (2×) seçenekleri devam eden sürüş, biniş ve kuyruk yürüyüşüne uygulanır. Sakin varsayılandır. Hareket azaltma tercihi desteklenir. Tam park görünümü ve en az 44 piksel araç dokunma alanı veren yakınlaştırma korunur.

Önceki 0.4.1–0.5.2 sürümlerinin kayıt biçimiyle uyumludur; ilk 18 bölümün kayıtları tekrar oynatılır. Farklı HTML dosyalarının aynı kayıt alanını paylaşması tarayıcıya bağlıdır.

## Çalıştırma ve doğrulama

```sh
npm test
npm run build
npm run serve
# http://localhost:8080/renk-duragi-0.6.0.html
```

Motor ve derleme için harici paket gerekmez. Tarayıcı testleri için Playwright ve Chromium gerekir:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:android
npm run test:scene
npm run test:experience
RENK_SMOKE=1 npm run test:browser
```

Alternatif Chromium yolu `RENK_CHROMIUM_PATH` ile verilebilir. `?test=1` test kancalarını açıp animasyonları hızlandırır; `?test=1&motion=1` gerçek animasyon hızını korur. Oyunun kuralları değişmez.

| Dosya | İçerik |
| --- | --- |
| `src/engine.js` | Fiziksel engeller, saf durum geçişleri, kayıt oynatma, çözüm arama |
| `src/levels.js` | Mevcut 18 ana bölüm |
| `src/routes.js` | Altı özel rota, çözüm ve kilitlenme yolları |
| `src/app.js` | Canlı kuyruk, animasyon, şehir haritası, ses ve kayıt |
| `scripts/author-routes.cjs` | Özel rotaların açık geometrisi ve deterministik kuyruk tasarımı |
| `scripts/build.cjs` | Bütün bölümlerin doğrulaması ve tek HTML dağıtımı |
| `tests/` | Motor, mobil yerleşim, eşzamanlılık ve deneyim testleri |

[Doğrulama](docs/verification.md) · [Tasarım](docs/design.md) · [İnsan denemesi](docs/playtest.md)

Bu bir SVG/HTML tarayıcı prototipidir; gerçek 3D veya APK/mağaza yayını değildir. Önceki sürümler kullanıcı tarafından Android'de denendi. 0.6'nın gerçek telefon performansı, sesi ve eğlencesi henüz kullanıcı denemesiyle değerlendirilmedi.
