import { useState, useEffect } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { db } from '../firebase.js'

/**
 * Hook ดึงข้อมูล real-time จาก Firebase Realtime Database
 * โครงสร้างข้อมูลใน Firebase:
 *   /readings/latest   → ค่าล่าสุดจาก ESP32
 *   /readings/history  → ประวัติย้อนหลัง
 */
export function useFirebaseData() {
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // ดึงค่า latest (real-time listener)
    const latestRef = ref(db, 'readings/latest')
    const historyRef = ref(db, 'readings/history')

    const unsubLatest = onValue(
      latestRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) setLatest(data)
        setLoading(false)
      },
      (err) => {
        console.error('Firebase latest error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    const unsubHistory = onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // แปลง object เป็น array แล้วเรียงตาม timestamp
          const arr = Object.entries(data)
            .map(([key, val]) => ({ id: key, ...val }))
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
            .slice(-50) // เอาแค่ 50 จุดล่าสุด
          setHistory(arr)
        }
      },
      (err) => console.error('Firebase history error:', err)
    )

    // Cleanup เมื่อ component ถูก unmount
    return () => {
      off(latestRef)
      off(historyRef)
    }
  }, [])

  return { latest, history, loading, error }
}
