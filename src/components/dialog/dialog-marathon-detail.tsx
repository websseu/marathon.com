import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDateTime } from '@/lib/utils'
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Star,
  Clock,
  Trophy,
  Building,
  Route,
  Eye,
  Send,
  Panda,
} from 'lucide-react'

interface Marathon {
  _id: string
  name: string
  status: string
  startDate: string
  location: string
  scale: number
  organizer: string
  courses: string[]
  numViews: number
  numLikes: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  description?: string
  regDate?: string
  sponsor?: string
  highlights?: string[]
  image?: string
}

interface DialogMarathonDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  marathon: Marathon | null
  onEdit?: () => void
}

export default function DialogMarathonDetail({
  open,
  onOpenChange,
  marathon,
}: DialogMarathonDetailProps) {
  if (!marathon) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '접수중':
        return {
          variant: 'outline' as const,
          className: 'text-green-700 border-green-300',
        }
      case '접수마감':
        return {
          variant: 'outline' as const,
          className: 'text-red-700 border-red-300',
        }
      case '접수대기':
        return {
          variant: 'outline' as const,
          className: 'text-yellow-700 border-yellow-300',
        }
      default:
        return {
          variant: 'outline' as const,
          className: 'text-gray-700 border-gray-300',
        }
    }
  }

  const statusBadge = getStatusBadge(marathon.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-blue-700 justify-center gap-1 text-xl'>
            <Panda className='h-5 w-5' />
            마라톤 대회 정보
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            마라톤 대회 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto'>
          {/* 대회명 */}
          <div className='flex items-start gap-2'>
            <Trophy className='h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>대회명:</span>
              <span className='ml-2 text-gray-900 break-words'>{marathon.name}</span>
            </div>
          </div>

          <Separator />

          {/* 상태 */}
          <div className='flex items-center gap-2'>
            <Star className='h-4 w-4 text-purple-600 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>상태:</span>
              <span className='ml-2'>
                <Badge variant={statusBadge.variant} className={statusBadge.className}>
                  {marathon.status}
                </Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* 대회 시작일 */}
          <div className='flex items-start gap-2'>
            <Clock className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>대회 시작일:</span>
              <span className='ml-2 text-gray-900'>{marathon.startDate}</span>
            </div>
          </div>

          <Separator />

          {/* 접수 기간 */}
          {marathon.regDate && (
            <>
              <div className='flex items-start gap-2'>
                <Calendar className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <span className='font-medium text-gray-700'>접수 기간:</span>
                  <span className='ml-2 text-gray-900 break-words'>{marathon.regDate}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* 장소 */}
          <div className='flex items-start gap-2'>
            <MapPin className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>장소:</span>
              <span className='ml-2 text-gray-900 break-words'>{marathon.location}</span>
            </div>
          </div>

          <Separator />

          {/* 규모 */}
          <div className='flex items-start gap-2'>
            <Users className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>규모:</span>
              <span className='ml-2 text-gray-900'>{marathon.scale.toLocaleString()}명</span>
            </div>
          </div>

          <Separator />

          {/* 주최자 */}
          <div className='flex items-start gap-2'>
            <Building className='h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>주최자:</span>
              <span className='ml-2 text-gray-900 break-words'>{marathon.organizer}</span>
            </div>
          </div>

          <Separator />

          {/* 스폰서 */}
          {marathon.sponsor && (
            <>
              <div className='flex items-start gap-2'>
                <Heart className='h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <span className='font-medium text-gray-700'>스폰서:</span>
                  <span className='ml-2 text-gray-900 break-words'>{marathon.sponsor}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* 코스 */}
          <div className='flex items-start gap-2'>
            <Route className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>코스:</span>
              <span className='ml-2 text-gray-900 break-words'>{marathon.courses.join(', ')}</span>
            </div>
          </div>

          <Separator />

          {/* 주요 특징 */}
          {marathon.highlights && marathon.highlights.length > 0 && (
            <>
              <div className='flex items-start gap-2'>
                <Star className='h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <span className='font-medium text-gray-700'>주요 특징:</span>
                  <span className='ml-2 text-gray-900 break-words'>
                    {marathon.highlights.join(', ')}
                  </span>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* 대회 설명 */}
          {marathon.description && (
            <>
              <div className='flex items-start gap-2'>
                <Eye className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1'>
                  <span className='font-medium text-gray-700'>대회 설명:</span>
                  <div className='mt-2 px-3 py-2 bg-gray-50 rounded-lg'>
                    <p className='text-gray-900 whitespace-pre-wrap break-words leading-6'>
                      {marathon.description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* 조회수 */}
          <div className='flex items-start gap-2'>
            <Eye className='h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>조회수:</span>
              <span className='ml-2 text-gray-900'>{marathon.numViews.toLocaleString()}회</span>
            </div>
          </div>

          <Separator />

          {/* 좋아요 */}
          <div className='flex items-start gap-2'>
            <Heart className='h-4 w-4 text-red-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>좋아요:</span>
              <span className='ml-2 text-gray-900'>{marathon.numLikes.toLocaleString()}개</span>
            </div>
          </div>

          <Separator />

          {/* 등록일 */}
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <span className='font-medium text-gray-700'>등록일:</span>
              <span className='ml-2 text-gray-900'>{formatDateTime(marathon.createdAt)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className='sm:justify-center border-t pt-4'>
          <Button
            onClick={() => onOpenChange(false)}
            className='w-full bg-blue-700 hover:bg-blue-800'
          >
            <Send /> 확인 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
