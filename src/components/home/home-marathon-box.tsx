import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dday, getStatusBadgeStyle } from '@/lib/utils'
import { Badge } from '../ui/badge'
import Image from 'next/image'
import {
  BookMarked,
  Calendar,
  Clock,
  MapPin,
  Medal,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Marathon } from '@/lib/type'

interface Props {
  marathons: Marathon[]
}

export default function HomeMarathonBox({ marathons }: Props) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {marathons.length > 0 ? (
        marathons.map((marathon: Marathon) => (
          <Card
            key={marathon._id}
            className='border-gray-100 hover:border-blue-600 transition-all'
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
        ))
      ) : (
        <div className='col-span-full text-center py-12 pt-16'>
          <p className='text-gray-500 font-nanum'>
            <Medal className='w-10 h-10 mx-auto mb-2 text-gray-400' />
            검색 결과가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
