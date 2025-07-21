'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Plus,
  Save,
  Panda,
  Trophy,
  Star,
  Calendar,
  MapPin,
  Users,
  Building,
  Route,
} from 'lucide-react'
import { toast } from 'sonner'
import { updateMarathon } from '@/lib/actions/marathon.action'

interface Marathon {
  _id: string
  name: string
  status: string
  startDate: string
  location: string
  scale: number
  organizer: string
  courses: string[]
  isPublished: boolean
  description?: string
  regDate?: string
  sponsor?: string
  highlights?: string[]
  image?: string
  numViews: number
  numLikes: number
  createdAt: string
  updatedAt: string
}

interface DialogMarathonEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  marathon: Marathon | null
  onUpdate: (updatedMarathon: Marathon) => void
}

// 수정용 스키마
const MarathonEditSchema = z.object({
  name: z.string().min(1, '대회명을 입력해주세요.'),
  status: z.enum(['접수중', '접수마감', '접수대기']),
  description: z.string().optional(),
  startDate: z.string().min(1, '대회 시작일을 입력해주세요.'),
  regDate: z.string().min(1, '접수 기간을 입력해주세요.'),
  location: z.string().min(1, '대회 장소를 입력해주세요.'),
  scale: z.number().min(0, '규모는 0 이상이어야 합니다.'),
  organizer: z.string().min(1, '주최자를 입력해주세요.'),
  sponsor: z.string().min(1, '스폰서를 입력해주세요.'),
  image: z.string().optional(),
  isPublished: z.boolean(),
})

type MarathonEditForm = z.infer<typeof MarathonEditSchema>

export default function DialogMarathonEdit({
  open,
  onOpenChange,
  marathon,
  onUpdate,
}: DialogMarathonEditProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<string[]>(marathon?.courses || [])
  const [newCourse, setNewCourse] = useState('')
  const [highlights, setHighlights] = useState<string[]>(
    marathon?.highlights || []
  )
  const [newHighlight, setNewHighlight] = useState('')

  const form = useForm<MarathonEditForm>({
    resolver: zodResolver(MarathonEditSchema),
    defaultValues: {
      name: marathon?.name || '',
      status:
        (marathon?.status as '접수중' | '접수마감' | '접수대기') || '접수중',
      description: marathon?.description || '',
      startDate: marathon?.startDate || '',
      regDate: marathon?.regDate || '',
      location: marathon?.location || '',
      scale: marathon?.scale || 0,
      organizer: marathon?.organizer || '',
      sponsor: marathon?.sponsor || '',
      image: marathon?.image || '',
      isPublished: marathon?.isPublished || false,
    },
  })

  // marathon이 바뀔 때마다 폼 값 동기화
  useEffect(() => {
    if (marathon) {
      form.reset({
        name: marathon.name,
        status: marathon.status as '접수중' | '접수마감' | '접수대기',
        description: marathon.description || '',
        startDate: marathon.startDate,
        regDate: marathon.regDate || '',
        location: marathon.location,
        scale: marathon.scale,
        organizer: marathon.organizer,
        sponsor: marathon.sponsor || '',
        image: marathon.image || '',
        isPublished: marathon.isPublished,
      })
      setCourses(marathon.courses || [])
      setHighlights(marathon.highlights || [])
    }
  }, [marathon, form])

  const addCourse = () => {
    if (newCourse.trim() && !courses.includes(newCourse.trim())) {
      setCourses([...courses, newCourse.trim()])
      setNewCourse('')
    }
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: MarathonEditForm) => {
    if (!marathon?._id) return

    try {
      setIsLoading(true)
      const result = await updateMarathon(marathon._id, {
        id: marathon._id,
        ...data,
        courses,
        highlights,
      })

      if (result.success) {
        toast.success('마라톤 정보가 성공적으로 수정되었습니다.')
        onUpdate({
          ...marathon,
          ...data,
          courses,
          highlights,
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || '마라톤 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('마라톤 수정 중 오류:', error)
      toast.error('마라톤 수정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
      setCourses(marathon?.courses || [])
      setHighlights(marathon?.highlights || [])
    }
    onOpenChange(isOpen)
  }

  if (!marathon) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-blue-700 justify-center gap-1 text-xl'>
            <Panda className='h-5 w-5' />
            마라톤 대회 수정
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            마라톤 대회 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 대회명 */}
              <div className='flex items-center gap-2'>
                <Trophy className='h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          대회명
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='대회명을 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 상태 */}
              <div className='flex items-center gap-2'>
                <Star className='h-4 w-4 text-purple-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          상태
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Button
                                type='button'
                                variant={
                                  field.value === '접수중'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='sm'
                                onClick={() => field.onChange('접수중')}
                                className='flex-1'
                              >
                                접수중
                              </Button>
                              <Button
                                type='button'
                                variant={
                                  field.value === '접수마감'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='sm'
                                onClick={() => field.onChange('접수마감')}
                                className='flex-1'
                              >
                                접수마감
                              </Button>
                              <Button
                                type='button'
                                variant={
                                  field.value === '접수대기'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='sm'
                                onClick={() => field.onChange('접수대기')}
                                className='flex-1'
                              >
                                접수대기
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 대회 시작일 */}
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='startDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          대회 시작일
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='대회 시작일을 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 접수 기간 */}
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='regDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          접수 기간
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='접수 기간을 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 장소 */}
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-red-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          장소
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='대회 장소를 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 규모 */}
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='scale'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          규모
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              type='number'
                              min={0}
                              placeholder='참가 규모를 입력하세요'
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 주최자 */}
              <div className='flex items-center gap-2'>
                <Building className='h-4 w-4 text-indigo-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='organizer'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          주최자
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='주최자를 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 스폰서 */}
              <div className='flex items-center gap-2'>
                <Building className='h-4 w-4 text-orange-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='sponsor'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          스폰서
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='스폰서를 입력하세요'
                              {...field}
                              className='h-9'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />

              {/* 코스 정보 */}
              <div className='flex items-start gap-2'>
                <Route className='h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <div className='flex flex-row items-start gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-1'>
                      코스
                    </FormLabel>
                    <div className='flex-[8_8_0%]'>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='코스를 입력하세요'
                            value={newCourse}
                            onChange={(e) => setNewCourse(e.target.value)}
                            className='h-9'
                          />
                          <Button
                            type='button'
                            onClick={addCourse}
                            size='sm'
                            className='px-3'
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                        {courses.length > 0 && (
                          <div className='flex flex-wrap gap-1'>
                            {courses.map((course, index) => (
                              <Badge
                                key={index}
                                variant='outline'
                                className='text-xs cursor-pointer'
                                onClick={() => removeCourse(index)}
                              >
                                {course}
                                <X className='h-3 w-3 ml-1' />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              {/* 주요 특징(하이라이트) */}
              <div className='flex items-start gap-2'>
                <Star className='h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <div className='flex flex-row items-start gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-1'>
                      주요 특징
                    </FormLabel>
                    <div className='flex-[8_8_0%]'>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='주요 특징을 입력하세요'
                            value={newHighlight}
                            onChange={(e) => setNewHighlight(e.target.value)}
                            className='h-9'
                          />
                          <Button
                            type='button'
                            onClick={() => {
                              if (
                                newHighlight.trim() &&
                                !highlights.includes(newHighlight.trim())
                              ) {
                                setHighlights([
                                  ...highlights,
                                  newHighlight.trim(),
                                ])
                                setNewHighlight('')
                              }
                            }}
                            size='sm'
                            className='px-3'
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                        {highlights.length > 0 && (
                          <div className='flex flex-wrap gap-1'>
                            {highlights.map((highlight, index) => (
                              <Badge
                                key={index}
                                variant='outline'
                                className='text-xs cursor-pointer'
                                onClick={() =>
                                  setHighlights(
                                    highlights.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                {highlight}
                                <X className='h-3 w-3 ml-1' />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />

              {/* 대회 설명 */}
              <div className='flex items-start gap-2'>
                <Route className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-1'>
                          설명
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Textarea
                              placeholder='대회 설명을 입력하세요'
                              {...field}
                              className='min-h-[80px]'
                            />
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className='sm:justify-center border-t pt-4 mt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-700 hover:bg-blue-800'
              >
                {isLoading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save /> 마라톤 수정
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
