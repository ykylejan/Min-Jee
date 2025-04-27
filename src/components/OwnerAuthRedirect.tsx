// components/OwnerAuthRedirect.tsx
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'

const OwnerAuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const [authChecked, setAuthChecked] = useState(false)
  const { accessToken, role } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!accessToken || role !== 'owner') {
      router.replace('/login')
    } else {
      setAuthChecked(true)
    }
  }, [accessToken, role, router])

  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FFFBF5] z-50">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#778768] border-r-transparent" />
        <span className="ml-2 text-gray-500 text-lg font-semibold">Verifying access...</span>
      </div>
    )
  }

  return <>{children}</>
}

export default OwnerAuthRedirect