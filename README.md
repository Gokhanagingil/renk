# Renk Durağı · Şehir hareketli — 0.4.0

**Yolu aç, peronda yer bırak, yolcuları koltuklarına yerleştir.**

[Oynanabilir tek dosya: renk-duragi-0.4.0.html](dist/renk-duragi-0.4.0.html). İndirip tarayıcıda aç. İnternet, hesap ve harici dosya gerekmez. GitHub dosya görüntüleyicisi oyunu çalıştırmaz.

## Bu sürüm

- Yeni şehir görünümü: koyu asfalt, mavi/beyaz arayüz, canlı araç renkleri, park çizgileri, yaya geçidi ve çıkış işaretleri.
- Açık araçlarda 4 veya 6 görünür koltuk; yürüyerek gelen yolcu seçilen koltuğa yerleşir.
- Varsayılan **Sakin** hareket. İsteğe bağlı **Normal** hız yalnızca %30 daha hızlıdır.
- Bir araç hareket ederken veya yolcu alırken diğer araçlar gönderilebilir. Ekran solmaz, park kilitlenmez.
- 18 sabit bölüm, bölüm başına **12–28 araç ve 48–120 yolcu**.
- Büyük otopark kaydırılır; araç dokunma alanları küçültülmez. Kuşbakışı harita tüm düzeni gösterir.
- Bekleyen yolcular kıpırdanır, el sallar, söylenir veya tuvalet ihtiyacını belli eder. Bunların kurallara etkisi yoktur.
- Hareket sırasında geri alma, yeniden başlama ve kayıt/devam desteklenir.

## Kurallar

1. Araca dokun. Önündeki hat park sınırına kadar açıksa ok yönünde çıkar.
2. Durağın **üç yeri** vardır. Yola çıkan araç hemen bir yer ayırır; bu yer araç ayrılana kadar doludur.
3. Yolcular sırayla aynı renk araca biner. Aynı renkte birden çok araç varsa önce gönderilen önceliklidir.
4. Dolu araç hareket edip perondan çıkınca yer boşalır. Kısmen dolu araç bekler.
5. Üç yeri yanlış renklerle doldurmak kilitlenmeye yol açar. Ücretsiz geri al veya yeniden dene.
6. Bütün yolcular binip araçlar ayrıldığında bölüm biter.

İlk sekiz bölümde üç renk, sonrasında dört renk bulunur. Renkler şekillerle de belirtilir. “Tüm sıra” gelecek yolcuları gösterir. Süre sınırı, reklam, ödeme, can veya yolcu sabırsızlığı cezası yoktur.

## Çalıştırma ve doğrulama

```sh
npm test
npm run build
npm run serve
# http://localhost:8080/renk-duragi-0.4.0.html
```

Motor ve derleme için harici paket gerekmez. Tarayıcı testleri için Playwright ve Chromium gerekir:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:browser
```

Alternatif Chromium yolu `RENK_CHROMIUM_PATH` ile verilebilir. `?test=1` animasyonları hızlandırır ve test kancalarını açar; kuralları değiştirmez. `?test=1&motion=1` test kancalarını gerçek animasyon hızıyla çalıştırır.

## Kaynaklar

| Dosya | İçerik |
| --- | --- |
| `src/engine.js` | Saf kurallar, fiziksel engeller, geçişler, tekrar oynatma ve çözüm arama |
| `src/levels.js` | 18 sabit bölüm ve doğrulanmış çözüm/kilitlenme yolları |
| `src/app.js` | Eşzamanlı animasyonlar, açık araçlar, yolcu davranışları, arayüz ve kayıt |
| `scripts/generate-levels.cjs` | Sabit tohumla çevrimdışı bölüm tasarımı |
| `scripts/build.cjs` | Bölüm doğrulama ve tek HTML dağıtımı |
| `tests/` | Motor ve dokunmatik tarayıcı doğrulaması |
| `docs/playtest.md` | 65+ oyuncuyla yapılacak deneme |

[Doğrulama notu](docs/verification.md) · [Tasarım kararları](docs/design.md) · [Çözüm kanıtları](qa/solutions.json)

Bu bir tarayıcı prototipidir. Gerçek 65+ oyuncu, Android/iOS cihaz ve Safari kabul testi henüz yapılmadı. APK/mağaza yayını değildir. 0.3 git geçmişinde, terk edilen 0.2 ise [arşiv dalında](https://github.com/Gokhanagingil/renk/tree/archive/shuttle-v0.2) korunur.
