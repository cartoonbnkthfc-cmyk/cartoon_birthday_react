import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin({ wishes, updateWishStatus }) {
  const [tab, setTab] = useState('pending');

  const filteredWishes = wishes.filter(w => w.status === tab);

  const pendingCount = wishes.filter(w => w.status === 'pending').length;
  const approvedCount = wishes.filter(w => w.status === 'approved').length;
  const hiddenCount = wishes.filter(w => w.status === 'hidden').length;

  return (
    <>
      <header style={{ background: "#fff", borderTop: "none", boxShadow: "0 4px 20px rgba(118,85,142,0.1)" }}>
        <Link to="/"><img className="logo" src="/assets/cartoon_logo.png" alt="Cartoon" /></Link>
        <div style={{fontWeight:800, color:'#ed589a'}}>⚙ ระบบจัดการหลังบ้าน</div>
      </header>
      <main style={{ marginTop: "110px" }}>
        <h2>จัดการคำอวยพร</h2>
        <div style={{display:'flex', gap:'10px', margin:'20px 0'}}>
          <button onClick={() => setTab('pending')} className={`action ${tab === 'pending' ? 'send' : 'preview'}`}>รออนุมัติ ({pendingCount})</button>
          <button onClick={() => setTab('approved')} className={`action ${tab === 'approved' ? 'send' : 'preview'}`}>ผ่านแล้ว ({approvedCount})</button>
          <button onClick={() => setTab('hidden')} className={`action ${tab === 'hidden' ? 'send' : 'preview'}`}>ซ่อนไว้ ({hiddenCount})</button>
        </div>
        
        <div className="wall">
          {filteredWishes.length === 0 && <div>ไม่มีข้อมูล</div>}
          {filteredWishes.map((w, i) => (
            <div key={w.id || i} className="wish" style={{background: w.bg}}>
              <div style={{fontWeight:800, color:'#ed589a'}}>{w.name}</div>
              <div style={{margin:'10px 0', whiteSpace:'pre-line'}}>{w.message}</div>
              {w.img && <img src={w.img} style={{width:'100%', borderRadius:'10px'}} alt="attached" />}
              
              <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                {tab !== 'approved' && (
                  <button className="action send" style={{padding:'8px', fontSize:'13px'}} onClick={() => updateWishStatus(w.id, 'approved')}>✔ อนุมัติ</button>
                )}
                {tab !== 'hidden' && (
                  <button className="action preview" style={{padding:'8px', fontSize:'13px'}} onClick={() => updateWishStatus(w.id, 'hidden')}>✕ ซ่อน</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
