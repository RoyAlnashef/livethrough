'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('_test').select('*').limit(1)
        if (error) throw error
        setIsConnected(true)
      } catch (error) {
        console.error('Error connecting to Supabase:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Status</h2>
      <p className={isConnected ? 'text-green-500' : 'text-red-500'}>
        {isConnected ? 'Connected to Supabase!' : 'Not connected to Supabase'}
      </p>
    </div>
  )
} 