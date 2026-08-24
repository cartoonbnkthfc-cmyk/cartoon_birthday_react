export default function Hero() {
  const text = "♡ Happy Cartoon 17th Birthday ♡ 26.08.2026 ♡ #17CANDLESWITHCARTOON \u00A0\u00A0\u00A0";

  return (
    <>
      <section id="home" className="hero-section">
        <picture className="hero-main">
          <source media="(max-width: 900px)" srcSet="/assets/hero_mobile.jpg" />
          <img src="/assets/hero_desktop.png" alt="Happy Cartoon Day" />
        </picture>

        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            <span>{text}{text}{text}{text}</span><span>{text}{text}{text}{text}</span>
          </div>
        </div>
      </section>
    </>
  );
}
