import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin({ wishes, updateWishStatus, deleteWish }) {
  const [tab, setTab] = useState('pending');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'cartoon17';

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100svh', background: 'linear-gradient(180deg, #f2a2c1 0%, #eaf6fa 100%)' }}>
        <div className="panel" style={{ width: '90%', maxWidth: '400px', textAlign: 'center', display: 'block' }}>
          <h2>🔒 ใส่รหัสผ่านแอดมิน</h2>
          <input 
            type="password" 
            placeholder="รหัสผ่าน..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (password === adminPassword) setIsAuthenticated(true);
                else alert('รหัสผ่านไม่ถูกต้อง ❌');
              }
            }}
            style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
          />
          <button 
            className="action send" 
            style={{ width: '100%' }}
            onClick={() => {
              if (password === adminPassword) setIsAuthenticated(true);
              else alert('รหัสผ่านไม่ถูกต้อง ❌');
            }}
          >
            เข้าสู่ระบบ
          </button>
          <div style={{ marginTop: '20px' }}>
            <Link to="/" style={{ color: '#9585ae', textDecoration: 'underline' }}>กลับหน้าแรก</Link>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="wall" style={{ maxWidth: '100%' }}>
          {filteredWishes.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#b09a90' }}>ไม่มีข้อมูล</div>}
          {filteredWishes.map((w, i) => (
            <div key={w.id || i}>
              <div className="letter-card" style={{ '--card-color': w.bg, aspectRatio: 'auto' }}>
                <div className="letter-header">
                  <span className="letter-number">{w.name}</span>
                </div>
                <div className="letter-body">
                  <p className="letter-msg letter-msg-full" style={{ fontSize: '13px' }}>{w.message}</p>
                  {w.img && (
                    <div className="letter-img-full" style={{ marginTop: '10px' }}>
                      <img src={w.img} alt="attached" />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {tab !== 'approved' && (
                  <button className="action send" style={{ padding: '8px 12px', fontSize: '13px', flex: 1 }} onClick={() => updateWishStatus(w.id, 'approved')}>✔ อนุมัติ</button>
                )}
                {tab !== 'hidden' && (
                  <button className="action preview" style={{ padding: '8px 12px', fontSize: '13px', flex: 1 }} onClick={() => updateWishStatus(w.id, 'hidden')}>✕ ซ่อน</button>
                )}
                <button className="action" style={{ padding: '8px 12px', fontSize: '13px', flex: 1, background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => { if (window.confirm('ต้องการลบคำอวยพรนี้จริงหรือไม่?')) deleteWish(w.id); }}>🗑 ลบ</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
