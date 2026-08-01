import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  subscribeToFilterLog,
  subscribeToMonthlyReadings,
  subscribeToPrimaryDevice,
  subscribeToRecentReadings,
  subscribeToUserDevices
} from '../lib/firestore.js'

const DeviceContext = createContext(null)

export function DeviceProvider({ children }) {
  const { user } = useAuth()
  const [device, setDevice] = useState(null)
  const [devices, setDevices] = useState([])
  const [recentReadings, setRecentReadings] = useState([]) // newest-first
  const [monthlyReadings, setMonthlyReadings] = useState([]) // newest-first, this calendar month
  const [filterLog, setFilterLog] = useState([])
  const [loading, setLoading] = useState(true)

  // Step 1: who is this user's device (and their full device list)?
  useEffect(() => {
    if (!user) {
      setDevice(null)
      setDevices([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubDevices = subscribeToUserDevices(user.uid, setDevices)
    const unsubDevice = subscribeToPrimaryDevice(user.uid, (d) => {
      setDevice(d)
      setLoading(false)
    })

    return () => {
      unsubDevices()
      unsubDevice()
    }
  }, [user])

  // Step 2: once we know the device id, listen to everything under it.
  // Separate effect so readings/filterLog listeners restart cleanly if the
  // primary device ever changes, without re-subscribing to the device list.
  useEffect(() => {
    if (!device) {
      setRecentReadings([])
      setMonthlyReadings([])
      setFilterLog([])
      return
    }

    const unsubRecent = subscribeToRecentReadings(device.id, setRecentReadings, 50)
    const unsubMonthly = subscribeToMonthlyReadings(device.id, setMonthlyReadings)
    const unsubFilterLog = subscribeToFilterLog(device.id, setFilterLog)

    return () => {
      unsubRecent()
      unsubMonthly()
      unsubFilterLog()
    }
  }, [device?.id])

  return (
    <DeviceContext.Provider
      value={{ device, devices, recentReadings, monthlyReadings, filterLog, loading }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  const ctx = useContext(DeviceContext)
  if (!ctx) throw new Error('useDevice must be used inside <DeviceProvider>')
  return ctx
}
