"use client";
import { useState } from "react";

export default function PricingPage() {
  const testimonials = [
    { name: "Elif & Murat", text: "Düğün fotoğraflarımızı toplamak inanılmaz kolaydı!" },
    { name: "Selin", text: "Her etkinliğimde QRROLL kullanıyorum. Mükemmel bir çözüm." },
    { name: "Merve & Kerem", text: "QR kodu masalara koyduk, herkes saniyeler içinde fotoğraf yükledi!" },
    { name: "Taha", text: "Organizasyon işinde devrim niteliğinde bir platform." },
  ];

  const cards = [
    "/wedding-card-1.jpg",
    "/wedding-card-2.jpg",
    "/wedding-card-3.jpg",
  ];

  const [index, setIndex] = useState(0);

  const nextCard = () => setIndex((index + 1) % cards.length);
  const prevCard = () => setIndex((index - 1 + cards.length) % cards.length);

  return (
    <div className="min-h-screen w-full relative bg-white">

      {/* ===== NAVBAR ===== */}
      <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">QRROLL</div>

          <div className="hidden sm:flex items-center gap-8 text-gray-700 font-medium">
            <a href="/" className="hover:text-black transition">Ana Sayfa</a>
            <a href="/pricing" className="hover:text-black transition">Fiyatlandırma</a>
            <a href="/login" className="hover:text-black transition">Giriş Yap</a>
            <button className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition">
              Kayıt Ol
            </button>
          </div>
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-center lg:text-left">

          {/* LEFT TEXT */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Misafirlerinizden <span className="underline decoration-2">fotoğraf</span>, video ve mesajları kolayca toplayın
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              QRROLL ile tüm etkinlik fotoğraflarını tek bir QR kod ile toplayın. 
              Misafirler sadece okutsun — fotoğraflar, videolar ve mesajlar otomatik olarak albümünüze aktarılsın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#plans"
                className="px-6 py-4 rounded-xl bg-black text-white text-lg font-semibold shadow hover:bg-gray-800 transition text-center"
              >
                Etkinlik QR Kodunu Al →
              </a>

              <a
                href="/how-it-works"
                className="px-6 py-4 rounded-xl border border-gray-700 text-gray-900 text-lg font-semibold hover:bg-gray-100 transition text-center"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </div>

          {/* ===== RIGHT — Card Slider ===== */}
          <div className="flex flex-col items-center gap-4">
            
            {/* BIGGER CARD */}
            <div className="w-[340px] sm:w-[380px] lg:w-[420px] h-auto rounded-2xl shadow-2xl border border-gray-300 overflow-hidden bg-white transition-all">
              <img
                src={cards[index]}
                alt="wedding card"
                className="w-full h-full object-cover"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={prevCard}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
              >
                ←
              </button>
              <button
                onClick={nextCard}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
              >
                →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="plans" className="w-full flex justify-center px-6 py-20 bg-white">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-14">
          
          {/* left text */}
          <div className="flex flex-col justify-start bg-white p-6 rounded-xl shadow">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Planınızı seçin</h2>
            <p className="text-lg text-gray-700 mb-4">
              Etkinliğiniz için en uygun fotoğraf paylaşım planını seçin.
            </p>
            <p className="text-lg text-gray-700">
              Ücretsiz olarak deneyebilir veya daha fazla özellik için yükseltme yapabilirsiniz.
            </p>
          </div>

          {/* free */}
          <div className="rounded-2xl border border-gray-200 shadow-lg p-8 flex flex-col bg-white">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ücretsiz Deneme</h3>
            <p className="text-gray-600 mb-6">Hızlıca deneyin — kredi kartı gerekmez.</p>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✓ 100 adede kadar fotoğraf ve video yükleme</li>
              <li>✓ Temel Albüm Erişimi</li>
              <li>✓ Sınırsız sayıda misafir ve katılımcı</li>
              <li>✓ Yüklenen dosyalar 7 gün boyunca saklanır.</li>
              <li>✓ Etkinlik tarihinden itibaren 3 saat boyunca aktiftir..</li>

            </ul>
            <button className="mt-auto w-full py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition">
              Ücretsiz Başlayın
            </button>
          </div>

          {/* digital */}
          <div className="rounded-2xl border border-gray-200 shadow-xl p-8 flex flex-col bg-white">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Dijital Paket</h3>
            <p className="text-gray-600">Küçük düğünler, kutlamalar ve diğer orta ölçekli etkinlikler için mükemmel.</p>
            <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-6">3000 TL</h1>

            <ul className="space-y-3 text-gray-700 mb-8">
               <li>✓ 500 adede kadar fotoğraf ve video yükleme</li>
              <li>✓ Sınırsız sayıda misafir ve katılımcı</li>
              <li>✓ Yüklenen dosyalar 30 gün boyunca saklanır.</li>
              <li>✓ Etkinlik tarihinden itibaren 7 gün boyunca geçerlidir.</li>
              <li>✓ Tüm fotoğraf ve videoları tek seferde indirin</li>
            </ul>

            <button className="mt-auto w-full py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition">
              Satın Al
            </button>
          </div>

        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-white py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Kullanıcı Yorumları
        </h2>

        <div className="overflow-x-auto no-scrollbar px-6">
          <div className="flex gap-6 w-max mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[350px] bg-gray-50 shadow-md p-6 rounded-2xl border border-gray-200"
              >
                <p className="text-gray-700 italic mb-4">“{t.text}”</p>
                <p className="font-semibold text-gray-900">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
