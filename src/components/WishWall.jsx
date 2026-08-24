import ScrollReveal from './ScrollReveal';

export default function WishWall({ wishes }) {
  const approvedWishes = wishes.filter(w => w.status === 'approved');

  return (
    <>
      <ScrollReveal>
        <h2 className="wallTitle" id="wall">♥ WISH WALL ♥</h2>
      </ScrollReveal>
      
      {approvedWishes.length === 0 ? (
        <ScrollReveal>
          <div className="wall empty-wall">
            <div className="empty-message">
              <div className="empty-heart">♡</div>
              <h3>ยังไม่มีคำอวยพร</h3>
              <p>คำอวยพรที่ได้รับการอนุมัติ<br/>จะปรากฏที่นี่ 💗</p>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <div className="wall">
          {approvedWishes.map((w, i) => (
            <ScrollReveal key={w.id || i} delay={(i % 10) * 0.1}>
              <div className="wish" style={{ background: w.bg }}>
                <div style={{fontWeight:800, color:'#ed589a'}}>{w.name}</div>
                <div style={{margin:'10px 0', whiteSpace:'pre-line'}}>{w.message}</div>
                {w.img && <img src={w.img} style={{width:'100%', borderRadius:'10px', marginTop:'10px'}} alt="attached" />}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
