import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin({
  wishes,
  updateWishStatus,
  deleteWish
}) {
  const [tab, setTab] = useState('pending');

  // จำสถานะ Login แม้ Refresh หน้า
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('adminAuthenticated') === 'true'
  );

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const adminPassword =
    import.meta.env.VITE_ADMIN_PASSWORD || 'cartoon17';

  // =========================
  // LOGIN
  // =========================
  const handleLogin = () => {
    if (password === adminPassword) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง ❌');
    }
  };

  // =========================
  // หน้า LOGIN ADMIN
  // =========================
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100svh',
          background:
            'linear-gradient(180deg, #f2a2c1 0%, #eaf6fa 100%)',
          padding: '20px',
        }}
      >
        <div
          className="panel"
          style={{
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
            display: 'block',
          }}
        >
          <h2>🔒 ใส่รหัสผ่านแอดมิน</h2>

          {/* =========================
              PASSWORD INPUT
          ========================= */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <input
              className="admin-password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่าน..."
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              style={{
                width: '100%',
                paddingRight: '52px',
              }}
            />

            {/* =========================
                SHOW / HIDE PASSWORD
            ========================= */}
            <button
              type="button"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              aria-label={
                showPassword
                  ? 'ซ่อนรหัสผ่าน'
                  : 'แสดงรหัสผ่าน'
              }
              title={
                showPassword
                  ? 'ซ่อนรหัสผ่าน'
                  : 'แสดงรหัสผ่าน'
              }
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                padding: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#7562a4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                // ตาขีด = กำลังแสดงรหัส
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9.9 4.2C10.6 4.07 11.3 4 12 4C17.5 4 21 9.5 21 9.5C21 9.5 20.25 10.68 18.9 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M6.6 6.6C4.4 8.1 3 10.5 3 10.5C3 10.5 6.5 16 12 16C13.5 16 14.8 15.6 16 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // ตาปกติ = รหัสถูกซ่อน
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12C2 12 5.5 6 12 6C18.5 6 22 12 22 12C22 12 18.5 18 12 18C5.5 18 2 12 2 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* =========================
              LOGIN BUTTON
          ========================= */}
          <button
            className="action send"
            style={{
              width: '100%',
            }}
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>

          <div
            style={{
              marginTop: '20px',
            }}
          >
            <Link
              to="/"
              style={{
                color: '#9585ae',
                textDecoration: 'underline',
              }}
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // FILTER DATA
  // =========================
  const filteredWishes = wishes.filter(
    (w) => w.status === tab
  );

  const pendingCount = wishes.filter(
    (w) => w.status === 'pending'
  ).length;

  const approvedCount = wishes.filter(
    (w) => w.status === 'approved'
  ).length;

  const hiddenCount = wishes.filter(
    (w) => w.status === 'hidden'
  ).length;

  // =========================
  // ADMIN PAGE
  // =========================
  return (
    <>
      {/* =========================
          HEADER
      ========================= */}
      <header
        style={{
          background: '#fff',
          borderTop: 'none',
          boxShadow:
            '0 4px 20px rgba(118,85,142,0.1)',
        }}
      >
        <Link to="/">
          <img
            className="logo"
            src="/assets/cartoon_logo.png"
            alt="Cartoon"
          />
        </Link>

        <div
          style={{
            fontWeight: 800,
            color: '#ed589a',
          }}
        >
          ⚙ ระบบจัดการหลังบ้าน
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}
      <main
        style={{
          marginTop: '110px',
        }}
      >
        <h2>จัดการคำอวยพร</h2>

        {/* =========================
            TABS
        ========================= */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            margin: '20px 0',
          }}
        >
          {/* รออนุมัติ */}
          <button
            onClick={() => setTab('pending')}
            className={`action ${
              tab === 'pending'
                ? 'send'
                : 'preview'
            }`}
          >
            รออนุมัติ ({pendingCount})
          </button>

          {/* ผ่านแล้ว */}
          <button
            onClick={() => setTab('approved')}
            className={`action ${
              tab === 'approved'
                ? 'send'
                : 'preview'
            }`}
          >
            ผ่านแล้ว ({approvedCount})
          </button>

          {/* ซ่อนไว้ */}
          <button
            onClick={() => setTab('hidden')}
            className={`action ${
              tab === 'hidden'
                ? 'send'
                : 'preview'
            }`}
          >
            ซ่อนไว้ ({hiddenCount})
          </button>
        </div>

        {/* =========================
            WISH CARDS
        ========================= */}
        <div
          className="wall"
          style={{
            maxWidth: '100%',
          }}
        >
          {/* ไม่มีข้อมูล */}
          {filteredWishes.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#b09a90',
              }}
            >
              ไม่มีข้อมูล
            </div>
          )}

          {/* รายการคำอวยพร */}
          {filteredWishes.map((w, i) => (
            <div key={w.id || i}>

              {/* =========================
                  CARD
              ========================= */}
              <div
                className="letter-card"
                style={{
                  '--card-color': w.bg,
                  aspectRatio: 'auto',
                }}
              >
                {/* Header */}
                <div className="letter-header">
                  <span className="letter-number">
                    {w.name}
                  </span>
                </div>

                {/* Body */}
                <div className="letter-body">
                  {/* รูปภาพ */}
                  {w.img && (
                    <div
                      className="letter-img-full"
                      style={{
                        marginBottom: '10px',
                      }}
                    >
                      <img
                        src={w.img}
                        alt="attached"
                      />
                    </div>
                  )}
                  <p
                    className="letter-msg letter-msg-full"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    {w.message}
                  </p>
                </div>
              </div>

              {/* =========================
                  ACTION BUTTONS
              ========================= */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '10px',
                }}
              >
                {/* อนุมัติ */}
                {tab !== 'approved' && (
                  <button
                    className="action send"
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      flex: 1,
                    }}
                    onClick={() =>
                      updateWishStatus(
                        w.id,
                        'approved'
                      )
                    }
                  >
                    ✔ อนุมัติ
                  </button>
                )}

                {/* ซ่อน */}
                {tab !== 'hidden' && (
                  <button
                    className="action preview"
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      flex: 1,
                    }}
                    onClick={() =>
                      updateWishStatus(
                        w.id,
                        'hidden'
                      )
                    }
                  >
                    ✕ ซ่อน
                  </button>
                )}

                {/* ลบ */}
                <button
                  className="action"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    flex: 1,
                    background: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const confirmed =
                      window.confirm(
                        'ต้องการลบคำอวยพรนี้จริงหรือไม่?'
                      );

                    if (confirmed) {
                      deleteWish(w.id);
                    }
                  }}
                >
                  🗑 ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}