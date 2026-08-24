import Header from '../components/Header';
import Hero from '../components/Hero';
import WishForm from '../components/WishForm';
import WishWall from '../components/WishWall';
import Footer from '../components/Footer';

export default function Home({ wishes, addWish, isLoading }) {
  return (
    <>
      <Header wishCount={wishes.filter(w => w.status === 'approved').length} />
      <Hero />
      <main>
        <WishForm onAddWish={addWish} />
        <WishWall wishes={wishes} isLoading={isLoading} />
      </main>
      <div className="marquee-strip marquee-strip-desktop" aria-hidden="true">
        <div className="marquee-track">
          <span>♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;</span>
          <span>♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;♡ Happy Cartoon 17th Birthday ｡ • 26.08.2026 • ｡ #17CANDLESWITHCARTOON &nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>
      <Footer />
    </>
  );
}
