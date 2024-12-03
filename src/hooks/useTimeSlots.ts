import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import type { TimeSlot } from '../types';

export const useTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeSlots = async () => {
    try {
      const timeSlotsRef = collection(db, 'timeSlots');
      const snapshot = await getDocs(timeSlotsRef);
      const slots = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TimeSlot[];
      
      setTimeSlots(slots.sort((a, b) => a.time.localeCompare(b.time)));
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const addTimeSlot = async (time: string) => {
    try {
      const timeSlotsRef = collection(db, 'timeSlots');
      await addDoc(timeSlotsRef, {
        time,
        available: true,
        createdAt: new Date().toISOString()
      });
      await fetchTimeSlots();
    } catch (error) {
      console.error('Error adding time slot:', error);
      throw error;
    }
  };

  const removeTimeSlot = async (time: string) => {
    try {
      const slot = timeSlots.find(s => s.time === time);
      if (slot?.id) {
        await deleteDoc(doc(db, 'timeSlots', slot.id));
        await fetchTimeSlots();
      }
    } catch (error) {
      console.error('Error removing time slot:', error);
      throw error;
    }
  };

  const updateTimeSlot = async (oldTime: string, newTime: string) => {
    try {
      const slot = timeSlots.find(s => s.time === oldTime);
      if (slot?.id) {
        await updateDoc(doc(db, 'timeSlots', slot.id), {
          time: newTime,
          updatedAt: new Date().toISOString()
        });
        await fetchTimeSlots();
      }
    } catch (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
  };

  const updateAvailability = async (time: string, available: boolean) => {
    try {
      const slot = timeSlots.find(s => s.time === time);
      if (slot?.id) {
        await updateDoc(doc(db, 'timeSlots', slot.id), {
          available,
          updatedAt: new Date().toISOString()
        });
        await fetchTimeSlots();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  };

  return {
    timeSlots,
    loading,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    updateAvailability
  };
};