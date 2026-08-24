import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase } from './supabase';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wishes:', error);
      } else if (data) {
        setWishes(data);
      }
    } catch (err) {
      console.error('Catch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('wishes_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => {
        fetchWishes(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addWish = async (wishData) => {
    try {
      // Optimistic update for fast UI
      const optimisticWish = {
        ...wishData,
        id: 'temp-' + Date.now(),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setWishes([optimisticWish, ...wishes]);
      alert('ส่งคำอวยพรเรียบร้อยแล้ว รอการอนุมัติเพื่อแสดงผลบนกำแพงนะคะ 💖');

      const newWish = {
        bg: wishData.bg,
        name: wishData.name,
        message: wishData.message,
        img: wishData.img,
        status: 'pending'
      };
      
      const { error } = await supabase.from('wishes').insert([newWish]);
      
      if (error) {
        console.error('Error inserting wish:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูลครับ');
        fetchWishes(); // Revert optimistic update
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateWishStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      const newWishes = wishes.map(w => w.id === id ? { ...w, status: newStatus } : w);
      setWishes(newWishes);

      const { error } = await supabase
        .from('wishes')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating status:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        fetchWishes(); // Revert optimistic update
      }
    } catch (err) {
      console.error(err);
    }
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
