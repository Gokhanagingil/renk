# Renk Durağı — 0.2.0 mekanik denemesi

**İndir, yer aç, yeni yolcu al.** İki durak arasında, dört koltuklu minibüslerin yolcularını planladığın kısa bir bulmaca.

Bu sürüm, renk eşleştirme oyunlarından farklı bir kararın eğlenceli olup olmadığını denemek için hazırlanmıştır. APK veya mağaza sürümü değildir.

## Oyna

[`dist/renk-duragi-0.2.0.html`](dist/renk-duragi-0.2.0.html) dosyasını indirip güncel bir tarayıcıda aç. Dosya tüm görselleri, stilleri ve kodu içerir; internet bağlantısı ve hesap gerektirmez. GitHub dosya görünümü oyunu çalıştırmaz: dosyayı indirmek gerekir.

Alternatif yerel çalıştırma:

```sh
npm run build
npm run serve
# http://localhost:8080/renk-duragi-0.2.0.html
```

## Nasıl oynanır?

1. Üstte **ŞİMDİ** yazan durağa bak: şemsiye Sahil, ağaç Park.
2. Minibüslerin dört camındaki yolcu hedeflerine bak. Bir minibüse dokun.
3. O durağın yolcuları iner. Açılan koltuklara, diğer durağa gitmek isteyen bekleyenler biner.
4. Sıra diğer durağa geçer. Aynı minibüsü değişen yolcularıyla tekrar seçebilirsin.
5. Bütün yolcuları ulaştır. En az seferle bitirirsen üç yıldız kazanırsın.

İş kalmayan durak otomatik atlanır. Araç dolu olmasa da servis sonunda ayrılır; dolması için bekleme yoktur. Araç renkleri eşleşme kuralı değildir. Yolcu hedefi hem renk hem simgeyle belirtilir.

## Kapsam

- 8 sabit bölüm; 2–4 araç; iki hedef; her araçta dört koltuk.
- Otomatik indirme/bindirme animasyonları, isteğe bağlı ses, 1× / 2× hız.
- Ücretsiz geri alma, çözümden hesaplanan ipucu, bölüm seçimi.
- Tarayıcı izin verdiğinde cihazda kayıt ve kaldığı yerden devam.
- Süre sınırı, reklam, satın alma, analitik veya dış istekte bulunan kod yok.
- Hareket azaltma tercihine uyum, etiketli düğmeler, klavye ile kullanım.

İlk mekanik denemesinde park engelleri ve üç araçlık durak yönetimi bilinçli olarak kapsam dışıdır. Amaç, indirme-bindirme kararını tek başına değerlendirmektir. Ayrıntılar: [tasarım kararı](docs/design.md).

## Geliştirme ve doğrulama

Çalıştırma ve derleme için harici JavaScript bağımlılığı yoktur. Node.js ile:

```sh
npm test
npm run build
```

Motor testleri yolcu korunumu, kapasite, indirme sırası ve sekiz bölümde erişilebilir durumları denetler. En az sefer hedefleri BFS ile bulunur ve simetri kullanmayan ayrı bir aramayla karşılaştırılır. Çözümler: [`qa/solutions.json`](qa/solutions.json).

Tarayıcı testi için yerel Playwright ve Chromium gereklidir:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:browser
```

Test geliştirme kancası yalnızca `?test=1` ile açılır. Test, sekiz bölümü dokunma olaylarıyla bitirir; geri alma, kayıt, bozuk kayıt, ipucu, animasyon ve 320–1280 piksel genişliklerini kontrol eder. Gerçek Android/iOS cihaz kabul testi ayrı olarak yapılmalıdır.

## Dosyalar

| Yol | İçerik |
| --- | --- |
| `src/engine.js` | Saf, deterministik kurallar ve en az sefer çözücüsü |
| `src/levels.js` | Sekiz sabit bölüm |
| `src/app.js` | Etkileşimler, kayıt, animasyonlar ve SVG çizimleri |
| `src/style.css` | Telefon öncelikli arayüz |
| `scripts/build.cjs` | Bağımlılıksız, tek dosyalık dağıtım |
| `tests/` | Motor ve tarayıcı testleri |
| `docs/playtest.md` | İlk oyuncu denemesinin soruları |

Marka adı çalışma adıdır. Çizimler ve arayüz bu proje için kodla oluşturulmuştur; başka oyunlardan görsel veya bölüm alınmamıştır.
