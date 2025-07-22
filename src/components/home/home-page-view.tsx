'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function HomePageView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const limit = searchParams.get('limit') || '10'

  // 글 개수 변경
  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('limit', newLimit)
    params.delete('page')
    router.push('?' + params.toString())
  }

  return (
    <div className='flex gap-1'>
      {/* 페이지 갯수 설정 */}
      <Select value={limit} onValueChange={handleLimitChange}>
        <SelectTrigger className='w-24'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='10'>10개</SelectItem>
          <SelectItem value='20'>20개</SelectItem>
          <SelectItem value='50'>50개</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
