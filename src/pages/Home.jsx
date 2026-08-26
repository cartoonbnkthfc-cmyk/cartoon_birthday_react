import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WishForm from '../components/WishForm';
import WishWall from '../components/WishWall';
import Footer from '../components/Footer';

export default function Home({ wishes, addWish, isLoading }) {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const checkDeadline = () => {
      // หมดเขตเขียนคำอวยพร: เที่ยงคืนคืนนี้ (26 ส.ค. 2569 เวลา 23:59:59 เปลี่ยนเป็น 27 ส.ค. 00:00:00 GMT+7)
      const deadline = new Date('2026-08-27T00:00:00+07:00').getTime();
      const now = new Date().getTime();
      setIsClosed(now >= deadline);
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header wishCount={wishes.filter(w => w.status === 'approved').length} />
      <Hero />
      <main>
        {!isClosed && <WishForm onAddWish={addWish} />}
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
