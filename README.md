# Renk Durağı · Park bulmacası — 0.3.0

**Araçların yolunu aç. Üç durak yerini planla. Yolcuları sırayla bindir.**

Kullanıcının ilk park sıkışıklığı fikrine dönülerek sıfırdan hazırlanmış oynanabilir prototip. Önceki indirme-bindirme denemesi terk edildi; [archive/shuttle-v0.2](https://github.com/Gokhanagingil/renk/tree/archive/shuttle-v0.2) dalında saklanıyor. Bu sürüm o mekaniği kullanmaz.

## Oyna

[`dist/renk-duragi-0.3.0.html`](dist/renk-duragi-0.3.0.html) dosyasını indirip tarayıcıda aç. GitHub dosya görüntüleyicisi oyunu çalıştırmaz; dosyayı indirmek gerekir. Çalışan oyun internet, hesap veya harici dosya gerektirmez.

Yerel sunucu seçeneği:

```sh
npm run build
npm run serve
# http://localhost:8080/renk-duragi-0.3.0.html
```

Bu sürüm tarayıcı prototipidir. APK veya mağaza yayını değildir.

## Kurallar

1. Araca dokun. Yalnızca üzerindeki ok yönünde çıkar; başka araç yolu kapatıyorsa hareket edemez.
2. Durağın **üç yeri** vardır. Çıkan araç boş yere yanaşır.
3. Sıranın en önündeki yolcu yalnızca aynı renk araca biner. Eşleşme yoksa arkasındakiler bekler.
4. Araç kapasitesi dolunca otomatik ayrılır ve yer açılır. Kısmen dolu araç bekler.
5. Yanlış renklerle üç yeri doldurursan durak kilitlenebilir. Ücretsiz geri alma ve yeniden deneme vardır.
6. Bütün yolcular binip bütün araçlar ayrılınca bölüm tamamlanır.

Araç üzerindeki sayı koltuk kapasitesidir; şekiller renkleri ayırt etmeye yardımcı olur. Kuyruğun tamamı “Tüm sıra” düğmesinden görülebilir. Süre sınırı, reklam, ödeme, can sistemi veya rastgele kuyruk değişimi yoktur.

## İçerik

- 12 sabit bölüm; 4 araçla başlayıp 10 araca çıkan park düzenleri.
- İlk sekiz bölümde üç renk; dokuzuncu bölümden itibaren dört renk.
- Gerçek dört yönlü araç engelleri; iki ve üç hücre uzunluğunda araçlar.
- 2–4 koltuk kapasitesi, otomatik biniş ve zincirleme ayrılış.
- Geri alma, mevcut durumdan çözüm arayan ipucu, kayıt/devam, bölüm seçimi.
- Hareket azaltma tercihine uyum, isteğe bağlı ses ve 1×/2× animasyon.

İlk iki bölüm elle düzenlendi. Diğerleri sabit tohumlu çevrimdışı bölüm aracıyla oluşturulup çözüm/kilitlenme kontrollerinden geçirilerek kaynak dosyasına kaydedildi. Oyun sırasında bölüm üretilmez veya düzen değiştirilmez. Gerçek oyuncu testine göre zorluk sırası yeniden ayarlanabilir.

## Doğrulama

```sh
npm test
npm run build
```

Motor ve derleme için harici paket gerekmez. Oyun motorunun 20 testi ile tüm bölümlerin başarılı ve başarısız yolları, koltuk/yolcu korunumu ve dört yöndeki fiziksel engeller denetlenir. Bağımsız bir hücre simülasyonu, geometrik çarpışma sonucunu her park edilmiş araç alt kümesinde karşılaştırır.

Tarayıcı testleri için:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:browser
```

Alternatif Chromium yolu `RENK_CHROMIUM_PATH` ile verilebilir. `?test=1` yalnızca test kancalarını ve hızlı animasyonu açar; üretim kurallarını değiştirmez.

Sonuçlar: [doğrulama notu](docs/verification.md). Bölüm çözümleri ve kilitlenme örnekleri: [`qa/solutions.json`](qa/solutions.json).

## Kaynaklar

| Yol | İçerik |
| --- | --- |
| `src/engine.js` | Araç engelleri, üç durak yeri, FIFO biniş, çözüm ve kilitlenme |
| `src/levels.js` | Oyun boyunca sabit kalan 12 bölüm |
| `src/app.js` | Mobil arayüz, SVG araç/yolcu çizimleri, animasyon ve kayıt |
| `scripts/generate-levels.cjs` | Çevrimdışı bölüm oluşturma; oyunda çalışmaz |
| `scripts/build.cjs` | Tek dosyalık çevrimdışı dağıtım |
| `tests/` | Motor ve dokunmatik tarayıcı testleri |
| `docs/playtest.md` | İlk insan denemesi için kısa gözlem listesi |

Gerçek Android/iOS cihaz kabul testi ve APK paketlemesi henüz yapılmadı. Önce yeni temel oyunun kullanıcı tarafından denenmesi hedefleniyor.
