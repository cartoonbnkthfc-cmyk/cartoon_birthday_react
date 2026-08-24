import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('cartoonWishes') || '[]');
      setWishes(Array.isArray(data) ? data : []);
    } catch {
      setWishes([]);
    }
  }, []);

  const saveWishes = (newWishes) => {
    setWishes(newWishes);
    localStorage.setItem('cartoonWishes', JSON.stringify(newWishes));
  };

  const addWish = (wishData) => {
    const newWish = {
      ...wishData,
      id: Date.now().toString(),
      status: 'pending',
      date: new Date().toISOString()
    };
    saveWishes([newWish, ...wishes]);
    alert('ส่งคำอวยพรเรียบร้อยแล้ว รอการอนุมัติเพื่อแสดงผลบนกำแพงนะคะ 💖');
  };

  const updateWishStatus = (id, newStatus) => {
    const newWishes = wishes.map(w => w.id === id ? { ...w, status: newStatus } : w);
    saveWishes(newWishes);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home wishes={wishes} addWish={addWish} />} />
        <Route path="/admin" element={<Admin wishes={wishes} updateWishStatus={updateWishStatus} />} />
      </Routes>
    </BrowserRouter>
  );
}
