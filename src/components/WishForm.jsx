import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

export default function WishForm({ onAddWish }) {
  const [bg, setBg] = useState('#ffd9ea');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const colors = ['#ffd9ea', '#dcecff', '#e8dcff', '#fff0d5', '#ffe0ed'];

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) {
      alert('กรุณากรอกชื่อและคำอวยพรให้ครบถ้วน');
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
  };

  const handlePreview = () => {
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
  };

  return (
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
                     alert('ไฟล์ใหญ่เกินไป');
                  }
                }}
              />
            </label>
            {file && <div style={{marginTop: '10px', color: '#f25498'}}>เลือกไฟล์แล้ว: {file.name}</div>}
          </div>

          <div className="buttons">
            <button className="action send" onClick={handleSubmit}>✉ ส่งคำอวยพร</button>
            <button className="action preview" onClick={handlePreview}>◉ ดูตัวอย่างการ์ด</button>
          </div>
        </div>

        <div>
          <div className="cardTitle">การ์ดของคุณ</div>
          <div className="card" style={{ background: bg }}>
            <div style={{fontSize:'23px', fontWeight:800}}>HAPPY 17TH BIRTHDAY</div>
            {file ? (
              <img src={URL.createObjectURL(file)} alt="Preview" style={{maxHeight:'230px', margin:'10px 0', objectFit:'contain'}} />
            ) : (
              <img src="/assets/cartoon_logo.png" alt="Cartoon" />
            )}
            <div className="cardName">{name || 'ชื่อของคุณ'}</div>
            <div style={{width:'70%', height:'1px', background:'#efb4d3', margin:'auto'}}></div>
            <div className="cardMsg">{message || 'คำอวยพรของคุณจะปรากฏที่นี่'}</div>
            <div style={{fontSize:'50px'}}>🎀</div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );

}
