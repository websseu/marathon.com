import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import { getDday, getDdayStyle, getStatusBadgeStyle } from '@/lib/utils'

interface Marathon {
  _id: string
  name: string
  slug: string
  status: string
  startDate: string
  location: string
  courses: string[]
  scale: number
  image: string
}

interface Props {
  marathons: Marathon[]
}

export default function FavoriteMarathon({ marathons }: Props) {
  if (marathons.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <p>즐겨찾기한 마라톤이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {marathons.map((marathon) => (
        <Link key={marathon._id} href={`/marathon/${marathon.slug}`}>
          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='p-4'>
              <div className='flex gap-4'>
                {/* 마라톤 이미지 */}
                <div className='w-20 h-24 bg-amber-300 rounded flex-shrink-0 overflow-hidden'>
                  <Image
                    src={marathon.image || '/placeholder.svg'}
                    width={80}
                    height={96}
                    alt={marathon.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* 마라톤 정보 */}
                <div className='flex-1 min-w-0'>
                  {/* 제목과 배지 */}
                  <div className='mb-2'>
                    <h3 className='font-semibold text-lg truncate mb-1'>{marathon.name}</h3>
                    <div className='flex items-center gap-2'>
                      <Badge className={getStatusBadgeStyle(marathon.status)}>
                        {marathon.status}
                      </Badge>
                      <Badge className={getDdayStyle(marathon.startDate)}>
                        {getDday(marathon.startDate)}
                      </Badge>
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className='space-y-1 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>{marathon.startDate}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>{marathon.location}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>{marathon.courses.join(', ')}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4 flex-shrink-0' />
                      <span className='truncate'>{marathon.scale.toLocaleString()}명 참가</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
