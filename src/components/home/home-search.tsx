'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function HomeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')

  // 검색 실행 함수
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    // 검색 시 첫 페이지로 이동
    params.delete('page')
    router.push('?' + params.toString())
  }

  // 엔터키로 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      {/* 검색영역 */}
      <div className='font-nanum relative w-full sm:w-80 flex gap-2'>
        <Search className='absolute left-3 top-3.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='대회명, 장소 검색'
          className='pl-9 h-11'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  )
}
