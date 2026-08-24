import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import html2canvas from 'html2canvas';

export default function WishForm({ onAddWish }) {
  const [bg, setBg] = useState('#ffd9ea');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popupMsg, setPopupMsg] = useState(null);
  const [recapData, setRecapData] = useState(null);

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
    
    // Compress image before saving to prevent base64 strings from being too large for mobile browsers
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1000;
          
          if (width > height) {
            if (width > max_size) {
              height = Math.round(height * (max_size / width));
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width = Math.round(width * (max_size / height));
              height = max_size;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          onAddWish({ bg, name, message, img: compressedBase64 });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      onAddWish({ bg, name, message, img: '' });
    }
    
    // Save for recap download
    setRecapData({
      bg,
      name,
      message,
      imgUrl: file ? URL.createObjectURL(file) : null
    });
    
    // Reset
    setName('');
    setMessage('');
    setFile(null);
    setShowPreview(false);
    setShowSuccess(true);
  };

  const handleDownloadRecap = async () => {
    const el = document.getElementById('recap-card');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `cartoon_17th_wish_${recapData.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกรูป');
    }
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
                ☁<br/>คลิกหรือลากไฟล์มาวางที่นี่<br/><small>JPG, PNG ขนาดไม่เกิน 25MB</small>
                <input 
                  type="file" 
                  hidden 
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files[0] && e.target.files[0].size <= 25 * 1024 * 1024) {
                       setFile(e.target.files[0]);
                    } else if (e.target.files[0]) {
                       setPopupMsg('ไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ขนาดไม่เกิน 25MB');
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
            <div className={`letter-card letter-card-modal ${file ? 'has-modal-img' : 'no-modal-img'}`} style={{ '--card-color': bg, margin: '0 auto' }}>
              <div className="letter-header">
                <span className="letter-number">คำอวยพรที่ ...</span>
              </div>
              <div className="letter-body letter-body-modal">
                {file && (
                  <div className="letter-img-full">
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  </div>
                )}
                <p className="letter-msg letter-msg-full">{message || 'คำอวยพรของคุณจะปรากฏที่นี่...'}</p>
                <div className="letter-name">— {name || 'ชื่อของคุณ'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && recapData && (
        <div className="wish-modal-overlay" onClick={() => setShowSuccess(false)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', width: 'fit-content', maxWidth: '800px', minWidth: '320px', animation: 'popIn 0.4s', flexShrink: 0 }}>
            
            {/* The white modal frame (like other popups) */}
            <div className="wish-modal-content success-modal" onClick={(e) => e.stopPropagation()} style={{ padding: '20px', margin: '0', width: '100%', maxWidth: '100%' }}>
              <div className="success-icon" style={{ fontSize: '36px', marginBottom: '10px' }}>💌</div>
              <h3 className="success-title" style={{ fontSize: '20px', marginBottom: '5px' }}>ส่งคำอวยพรเรียบร้อยแล้ว!</h3>
              <p className="success-text" style={{ fontSize: '13px', marginBottom: '20px' }}>รอการอนุมัติเพื่อแสดงผลบนกำแพงนะคะ 🩷</p>
              
              {/* Recap Card */}
              <div id="recap-card" className={`letter-card letter-card-modal ${recapData.imgUrl ? 'has-modal-img' : 'no-modal-img'}`} style={{ '--card-color': recapData.bg, margin: '0 auto', textAlign: 'left', pointerEvents: 'none', position: 'relative' }}>
                <div className="letter-header" style={{ position: 'relative' }}>
                <span className="letter-number">Cartoon's Birthday 🎂</span>
                <img 
                  src="/assets/cartoon_logo.png" 
                  alt="Cartoon Logo" 
                  style={{ 
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '55px', 
                    opacity: 0.95,
                    zIndex: 10
                  }} 
                />
              </div>
                <div className="letter-body letter-body-modal" style={{ overflow: 'hidden' }}>
                  {recapData.imgUrl && (
                    <div className="letter-img-full">
                      <img src={recapData.imgUrl} alt="Attached" />
                    </div>
                  )}
                  <p className="letter-msg letter-msg-full">{recapData.message}</p>
                  <div className="letter-name">— {recapData.name}</div>
                </div>
              </div>
            </div>

            {/* Floating Buttons Below */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', gap: '10px' }}>
              <button 
                className="recap-action-btn recap-action-dl"
                onClick={(e) => { e.stopPropagation(); handleDownloadRecap(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                ดาวน์โหลดรูปภาพ / Share to X
              </button>
              
              <button 
                className="recap-action-btn recap-action-close"
                onClick={() => setShowSuccess(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                ปิด
              </button>
            </div>
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
