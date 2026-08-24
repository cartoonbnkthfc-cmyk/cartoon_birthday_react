import Header from '../components/Header';
import Hero from '../components/Hero';
import WishForm from '../components/WishForm';
import WishWall from '../components/WishWall';

export default function Home({ wishes, addWish }) {
  return (
    <>
      <Header wishCount={wishes.filter(w => w.status === 'approved').length} />
      <Hero />
      <main>
        <WishForm onAddWish={addWish} />
        <WishWall wishes={wishes} />
      </main>
      <footer>
        <div style={{fontWeight:800, marginBottom:'8px'}}>#17CANDLESWITHCARTOON</div>
        <div>ขอบคุณที่อยู่เคียงข้างและซัพพอร์ต Cartoon เสมอมา 💗</div>
      </footer>
    </>
  );
}
