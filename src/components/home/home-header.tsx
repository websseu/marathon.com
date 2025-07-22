'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface HomeHeaderProps {
  stats: {
    total: number
    accepting: number
    closed: number
    waiting: number
  }
}

export default function HomeHeader({ stats }: HomeHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || 'all'

  // 상태 버튼 클릭 시 쿼리 파라미터 변경
  const handleStatusClick = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete('search') // 검색어 초기화
    params.delete('page') // 페이지도 초기화(선택)
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    router.push('?' + params.toString())
  }

  return (
    <Card className='border-gray-100 mb-6'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl font-gmarket text-blue-700'>
          2025 마라톤
        </CardTitle>
        <CardDescription>
          서로를 응원하며 완주의 기쁨을 나누는 마라톤 축제에 여러분을
          초대합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <button
            className={`text-center p-4 rounded border transition-all cursor-pointer ${
              currentStatus === 'all'
                ? 'bg-blue-100 border-blue-500'
                : 'bg-blue-50 border-blue-50 hover:border-blue-500'
            }`}
            onClick={() => handleStatusClick('all')}
          >
            <div className='text-2xl font-bold text-blue-700'>
              {stats.total}
            </div>
            <div className='text-sm text-gray-600'>총 대회 수</div>
          </button>
          <button
            className={`text-center p-4 rounded border transition-all cursor-pointer ${
              currentStatus === '접수중'
                ? 'bg-green-100 border-green-500'
                : 'bg-green-50 border-green-50 hover:border-green-500'
            }`}
            onClick={() => handleStatusClick('접수중')}
          >
            <div className='text-2xl font-bold text-green-700'>
              {stats.accepting}
            </div>
            <div className='text-sm text-gray-600'>접수중</div>
          </button>
          <button
            className={`text-center p-4 rounded border transition-all cursor-pointer ${
              currentStatus === '접수마감'
                ? 'bg-purple-100 border-purple-500'
                : 'bg-purple-50 border-purple-50 hover:border-purple-500'
            }`}
            onClick={() => handleStatusClick('접수마감')}
          >
            <div className='text-2xl font-bold text-purple-700'>
              {stats.closed}
            </div>
            <div className='text-sm text-gray-600'>접수마감</div>
          </button>
          <button
            className={`text-center p-4 rounded border transition-all cursor-pointer ${
              currentStatus === '접수대기'
                ? 'bg-orange-100 border-orange-500'
                : 'bg-orange-50 border-orange-50 hover:border-orange-500'
            }`}
            onClick={() => handleStatusClick('접수대기')}
          >
            <div className='text-2xl font-bold text-orange-700'>
              {stats.waiting}
            </div>
            <div className='text-sm text-gray-600'>접수대기</div>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
