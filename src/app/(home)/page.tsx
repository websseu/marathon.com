import React from 'react'
import { getAllMarathonsPage } from '@/lib/actions/marathon.action'
import { dday, getStatusBadgeStyle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Users,
  BookMarked,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'

interface Marathon {
  _id: string
  name: string
  status: string
  startDate: string
  regDate: string
  location: string
  courses: string[]
  scale: number
  description: string
  highlights: string[]
  image: string
  numLikes: number
}

export default async function HomePage() {
  const result = await getAllMarathonsPage(1, 12)
  const marathons = result.success ? result.marathons : []

  return (
    <>
      {/* 마라톤 헤더 */}
      <Card className='border-gray-100 mb-6'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl font-gmarket text-blue-700'>
            2025 마라톤
          </CardTitle>
          <CardDescription>
            원하는 월을 선택하여 해당 월의 마라톤 일정을 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='font-nanum grid grid-cols-6 gap-1 mb-4'>
            {[...Array(12)].map((_, i) => (
              <Button
                key={i + 1}
                variant='outline'
                className='text-sm px-0 py-2 w-full min-w-0 rounded'
              >
                {i + 1}월
              </Button>
            ))}
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-blue-50 rounded'>
              <div className='text-2xl font-bold text-blue-700'>2</div>
              <div className='text-sm text-gray-600'>총 대회 수</div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded'>
              <div className='text-2xl font-bold text-green-700'>3</div>
              <div className='text-sm text-gray-600'>접수중</div>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded'>
              <div className='text-2xl font-bold text-purple-700'>4</div>
              <div className='text-sm text-gray-600'>접수마감</div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded'>
              <div className='text-2xl font-bold text-orange-700'>5</div>
              <div className='text-sm text-gray-600'>접수대기</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 마라톤 정보 섹션 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {marathons.map((marathon: Marathon) => (
          <Card
            key={marathon._id}
            className='border-gray-100 hover:border-blue-100 transition-all'
          >
            <CardHeader>
              <CardTitle className='text-xl font-gmarket text-gray-900 truncate whitespace-nowrap'>
                {marathon.name}
              </CardTitle>
              <div className='flex items-center gap-1 mb-2'>
                <Badge className={getStatusBadgeStyle(marathon.status)}>
                  {marathon.status}
                </Badge>
                <Badge
                  className={
                    dday(marathon.startDate) === '종료'
                      ? 'border-gray-400 bg-transparent text-gray-500'
                      : 'border-red-600 bg-transparent text-red-600'
                  }
                >
                  {dday(marathon.startDate)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='flex gap-3'>
                <div className='w-[80px] h-[103px] bg-amber-300 rounded flex-shrink-0 overflow-hidden'>
                  <Image
                    src={marathon.image || '/marathon/no.jpg'}
                    width={160}
                    height={206}
                    alt={marathon.name}
                  />
                </div>
                <div className='flex-1 space-y-2 min-w-0'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4 flex-shrink-0' />
                    <span className='truncate whitespace-nowrap'>
                      {marathon.startDate.substring(0, 13)}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4 flex-shrink-0' />
                    <span className='truncate whitespace-nowrap'>
                      {marathon.location}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Clock className='h-4 w-4 flex-shrink-0' />
                    <span className='truncate whitespace-nowrap'>
                      {marathon.courses.join(', ')}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Users className='h-4 w-4 flex-shrink-0' />
                    <span className='truncate whitespace-nowrap'>
                      {marathon.scale.toLocaleString()}명 참가
                    </span>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <p className='text-sm text-muted-foreground leading-relaxed line-clamp-2'>
                {marathon.description}
              </p>
              {/* 하이라이트 */}
              {marathon.highlights && marathon.highlights.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                    <Star className='h-4 w-4 text-yellow-500' />
                    <span>주요 특징</span>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {marathon.highlights.map((highlight: string) => (
                      <Badge
                        key={highlight}
                        variant='outline'
                        className='text-xs'
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* 액션 버튼 */}
              <div className='flex gap-2 pt-2'>
                <Button size='sm' className='flex-1'>
                  <TrendingUp className='h-4 w-4 mr-1' />
                  상세정보
                </Button>
                <Button size='sm' variant='outline'>
                  <BookMarked className='h-4 w-4' />
                  {marathon.numLikes}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
