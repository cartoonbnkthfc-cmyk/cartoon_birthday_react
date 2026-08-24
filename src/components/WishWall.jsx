import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

export default function WishWall({ wishes }) {
  const [selectedWish, setSelectedWish] = useState(null);
  const approvedWishes = wishes.filter(w => w.status === 'approved');

  const [showAll, setShowAll] = useState(false);
  const displayedWishes = showAll ? approvedWishes : approvedWishes.slice(0, 6);

  useEffect(() => {
    if (selectedWish) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWish]);

  const closeModal = (e) => {
    if (e.target.className === 'wish-modal-overlay') {
      setSelectedWish(null);
    }
  };

  // Card on the wall (compact, text clamped)
  const WallCard = ({ w, index }) => (
    <div className="letter-card" style={{ '--card-color': w.bg }}>
      <div className="letter-header">
        <span className="letter-number">คำอวยพรที่ {approvedWishes.length - index}</span>
      </div>
      <div className="letter-body">
        <div className="letter-msg-area">
          <p className="letter-msg">{w.message}</p>
          {w.img && (
            <div className="letter-thumb">
              <img src={w.img} alt="แนบรูป" />
            </div>
          )}
        </div>
        <div className="letter-name">— {w.name}</div>
        <div className="letter-footer">
          {w.img && <span className="letter-has-img">📷 มีรูป</span>}
          <span className="letter-read-more">คลิกเพื่ออ่านเต็ม</span>
        </div>
      </div>
    </div>
  );

  // Full card in the modal (no clamp, show image)
  const ModalCard = ({ w, index }) => (
    <div className="letter-card letter-card-modal" style={{ '--card-color': w.bg }}>
      <div className="letter-header">
        <span className="letter-number">คำอวยพรที่ {approvedWishes.length - index}</span>
      </div>
      <div className="letter-body letter-body-modal">
        <p className="letter-msg letter-msg-full">{w.message}</p>
        {w.img && (
          <div className="letter-img-full">
            <img src={w.img} alt="attached" />
          </div>
        )}
        <div className="letter-name">— {w.name}</div>
      </div>
    </div>
  );

  return (
    <>
      <ScrollReveal>
        <h2 className="wallTitle" id="wall">
          <span className="char-pink">W</span>
          <span className="char-orange">I</span>
          <span className="char-yellow">S</span>
          <span className="char-purple">H</span>
          <span> </span>
          <span className="char-pink">W</span>
          <span className="char-orange">A</span>
          <span className="char-yellow">L</span>
          <span className="char-purple">L</span>
        </h2>
      </ScrollReveal>
      
      {approvedWishes.length === 0 ? (
        <ScrollReveal>
          <div className="wall empty-wall">
            <div className="empty-message">
              <div className="empty-heart">♡</div>
              <h3>ยังไม่มีคำอวยพร</h3>
              <p>คำอวยพรที่ได้รับการอนุมัติ<br/>จะปรากฏที่นี่</p>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <>
          <div className="wall">
            {displayedWishes.map((w, i) => (
              <ScrollReveal key={w.id || i} delay={i < 6 ? (i % 3) * 0.08 : (i % 3) * 0.03}>
                <div 
                  className="wish-card-wrapper" 
                  onClick={() => setSelectedWish(w)}
                >
                  <WallCard w={w} index={i} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {approvedWishes.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                className="total-wishes-badge btn-hover" 
                onClick={() => setShowAll(!showAll)}
                style={{ cursor: 'pointer' }}
              >
                {showAll ? 'ย่อคำอวยพร ▴' : `ดูคำอวยพรทั้งหมด (${approvedWishes.length}) ▾`}
              </button>
            </div>
          )}
        </>
      )}

      {selectedWish && (
        <div className="wish-modal-overlay" onClick={closeModal}>
          <div className="wish-modal-content">
            <button className="wish-modal-close" onClick={() => setSelectedWish(null)}>✕</button>
            <ModalCard w={selectedWish} index={approvedWishes.findIndex(w => w === selectedWish)} />
          </div>
        </div>
      )}
    </>
  );
}
