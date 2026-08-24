import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase } from './supabase';

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // เรียงคำอวยพรใหม่ -> เก่า
  // =========================
  const sortWishes = (items) => {
    return [...items].sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    );
  };

  // =========================
  // โหลดข้อมูลครั้งแรก
  // =========================
  const fetchWishes = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishes:', error);
        return;
      }

      setWishes(data || []);
    } catch (err) {
      console.error('Catch fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // โหลดข้อมูล + Realtime
  // =========================
  useEffect(() => {
    fetchWishes();

    const channel = supabase
      .channel('wishes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          const newWish = payload.new;

          setWishes((prev) => {
            // ป้องกันข้อมูลซ้ำ
            const withoutDuplicate = prev.filter(
              (w) => w.id !== newWish.id
            );

            return sortWishes([
              newWish,
              ...withoutDuplicate,
            ]);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          const updatedWish = payload.new;

          setWishes((prev) => {
            const exists = prev.some(
              (w) => w.id === updatedWish.id
            );

            // ถ้ามีอยู่แล้ว -> อัปเดต
            if (exists) {
              return sortWishes(
                prev.map((w) =>
                  w.id === updatedWish.id
                    ? updatedWish
                    : w
                )
              );
            }

            // ถ้ายังไม่มี -> เพิ่มเข้าไป
            return sortWishes([
              updatedWish,
              ...prev,
            ]);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'wishes',
        },
        (payload) => {
          const deletedId = payload.old?.id;

          if (!deletedId) return;

          setWishes((prev) =>
            prev.filter((w) => w.id !== deletedId)
          );
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    // ปิด channel เมื่อ component ถูกถอด
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // =========================
  // เพิ่มคำอวยพร
  // =========================
  const addWish = async (wishData) => {
    try {
      const newWish = {
        bg: wishData.bg,
        name: wishData.name,
        message: wishData.message,
        img: wishData.img || null,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('wishes')
        .insert([newWish])
        .select()
        .single();

      if (error) {
        console.error('Error inserting wish:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกคำอวยพร');
        return false;
      }

      // เพิ่มในหน้าจอทันทีหลัง Supabase สำเร็จ
      // ถ้า Realtime เพิ่มมาก่อนแล้ว จะไม่เกิดรายการซ้ำ
      if (data) {
        setWishes((prev) => {
          const withoutDuplicate = prev.filter(
            (w) => w.id !== data.id
          );

          return sortWishes([
            data,
            ...withoutDuplicate,
          ]);
        });
      }

      return true;
    } catch (err) {
      console.error('Add wish error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกคำอวยพร');
      return false;
    }
  };

  // =========================
  // อนุมัติ / ซ่อน
  // =========================
  const updateWishStatus = async (
    id,
    newStatus
  ) => {
    // ป้องกัน id ที่ผิด
    if (!id) {
      console.error('Wish ID is missing');
      return false;
    }

    try {
      // ทำ Supabase ให้สำเร็จก่อน
      const { error } = await supabase
        .from('wishes')
        .update({
          status: newStatus,
        })
        .eq('id', id);

      if (error) {
        console.error(
          'Error updating wish status:',
          error
        );

        alert(
          'เกิดข้อผิดพลาดในการอัปเดตสถานะ'
        );

        return false;
      }

      // จากนั้นค่อยอัปเดตหน้าจอ
      setWishes((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                status: newStatus,
              }
            : w
        )
      );

      return true;
    } catch (err) {
      console.error(
        'Update wish status error:',
        err
      );

      alert(
        'เกิดข้อผิดพลาดในการอัปเดตสถานะ'
      );

      return false;
    }
  };

  // =========================
  // ลบคำอวยพร
  // =========================
  const deleteWish = async (id) => {
    // ป้องกัน id ที่ผิด
    if (!id) {
      console.error('Wish ID is missing');
      return false;
    }

    try {
      // ลบใน Supabase ก่อน
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Error deleting wish:',
          error
        );

        alert(
          'เกิดข้อผิดพลาดในการลบคำอวยพร'
        );

        return false;
      }

      // เมื่อลบในฐานข้อมูลสำเร็จ
      // ค่อยลบออกจากหน้าจอ
      setWishes((prev) =>
        prev.filter((w) => w.id !== id)
      );

      return true;
    } catch (err) {
      console.error(
        'Delete wish error:',
        err
      );

      alert(
        'เกิดข้อผิดพลาดในการลบคำอวยพร'
      );

      return false;
    }
  };

  // =========================
  // Routes
  // =========================
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              wishes={wishes}
              addWish={addWish}
              isLoading={isLoading}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <Admin
              wishes={wishes}
              updateWishStatus={
                updateWishStatus
              }
              deleteWish={deleteWish}
              isLoading={isLoading}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}