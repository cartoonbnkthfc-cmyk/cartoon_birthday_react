import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

export default function WishForm({ onAddWish }) {
  const [bg, setBg] = useState('#ffd9ea');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popupMsg, setPopupMsg] = useState(null);

  useEffect(() => {
    if (showPreview || showSuccess || popupMsg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreview, showSuccess, popupMsg]);

  const colors = ['#ffd9ea', '#dcecff', '#e8dcff', '#fff0d5', '#ffe0ed'];

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) {
      setPopupMsg('กรุณากรอกชื่อและคำอวยพรให้ครบถ้วน');
      return;
    }
    
    // Convert file to base64 if exists (simulate old behavior)
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onAddWish({ bg, name, message, img: e.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      onAddWish({ bg, name, message, img: '' });
    }
    
    // Reset
    setName('');
    setMessage('');
    setFile(null);
    setShowPreview(false);
    setShowSuccess(true);
  };

  return (
    <>
      <ScrollReveal>
        <section className="panel" id="wish">
          <div>
            <h2>♡ เขียนคำอวยพรวันเกิดให้ Cartoon</h2>
            <div className="sub">คำอวยพรจะรอตรวจสอบก่อนแสดงบน WISH WALL</div>
            
            <div className="step">
              <div className="stepTitle">❶ เลือกการ์ดคำอวยพร</div>
              <div className="colors">
                {colors.map((c, i) => (
                  <button 
                    key={i} 
                    className={`color c${i+1} ${bg === c ? 'selected' : ''}`} 
                    data-bg={c}
                    style={{ background: c }}
                    onClick={() => setBg(c)}
                  />
                ))}
              </div>
            </div>

            <div className="step">
              <div className="stepTitle">❷ ใส่ชื่อของคุณ</div>
              <input 
                maxLength="40" 
                placeholder="ชื่อของคุณ" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="step">
              <div className="stepTitle">❸ เขียนคำอวยพร</div>
              <textarea 
                maxLength="500" 
                placeholder="เขียนคำอวยพรให้ Cartoon..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
            </div>

            <div className="step">
              <div className="stepTitle">❹ รูปภาพ (ไม่บังคับ)</div>
              <label className="upload">
                ☁<br/>คลิกหรือลากไฟล์มาวางที่นี่<br/><small>JPG, PNG ขนาดไม่เกิน 5MB</small>
                <input 
                  type="file" 
                  hidden 
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0] && e.target.files[0].size <= 5 * 1024 * 1024) {
                       setFile(e.target.files[0]);
                    } else {
                       setPopupMsg('ไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB');
                    }
                  }}
                />
              </label>
              {file && <div style={{marginTop: '10px', color: '#f25498'}}>เลือกไฟล์แล้ว: {file.name}</div>}
            </div>

            <div className="buttons">
              <button className="action send" onClick={handleSubmit}>✉ ส่งคำอวยพร</button>
              <button className="action preview" onClick={() => setShowPreview(true)}>◉ ดูตัวอย่างการ์ด</button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {showPreview && (
        <div className="wish-modal-overlay" onClick={(e) => {
          if(e.target.className === 'wish-modal-overlay' || e.target.className === 'wish-modal-close') {
            setShowPreview(false);
          }
        }}>
          <div className="wish-modal-content">
            <button className="wish-modal-close" onClick={() => setShowPreview(false)}>✕</button>
            <div className="letter-card letter-card-modal" style={{ '--card-color': bg, margin: '0 auto', maxWidth: '400px' }}>
              <div className="letter-header">
                <span className="letter-number">คำอวยพรที่ ...</span>
              </div>
              <div className="letter-body letter-body-modal">
                <p className="letter-msg letter-msg-full">{message || 'คำอวยพรของคุณจะปรากฏที่นี่...'}</p>
                {file && (
                  <div className="letter-img-full">
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  </div>
                )}
                <div className="letter-name">— {name || 'ชื่อของคุณ'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="wish-modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="wish-modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">💌</div>
            <h3 className="success-title">ส่งคำอวยพรเรียบร้อยแล้ว!</h3>
            <p className="success-text">รอการอนุมัติเพื่อแสดงผลบนกำแพงนะคะ 🩷</p>
            <button className="success-btn" onClick={() => setShowSuccess(false)}>ตกลง</button>
          </div>
        </div>
      )}

      {popupMsg && (
        <div className="wish-modal-overlay" onClick={() => setPopupMsg(null)}>
          <div className="wish-modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">⚠️</div>
            <p className="success-text" style={{ marginBottom: '20px' }}>{popupMsg}</p>
            <button className="success-btn" onClick={() => setPopupMsg(null)}>ตกลง</button>
          </div>
        </div>
      )}
    </>
  );
}
