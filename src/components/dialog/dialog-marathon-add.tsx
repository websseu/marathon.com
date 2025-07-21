'use client'

import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Heart,
  FileText,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { createMarathon } from '@/lib/actions/marathon.action'

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

interface DialogMarathonAddProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newMarathon: Marathon) => void
}

// 추가용 스키마
const MarathonAddSchema = z.object({
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

type MarathonAddForm = z.infer<typeof MarathonAddSchema>

export default function DialogMarathonAdd({
  open,
  onOpenChange,
  onAdd,
}: DialogMarathonAddProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<string[]>([])
  const [newCourse, setNewCourse] = useState('')
  const [highlights, setHighlights] = useState<string[]>([])
  const [newHighlight, setNewHighlight] = useState('')

  const form = useForm<MarathonAddForm>({
    resolver: zodResolver(MarathonAddSchema),
    defaultValues: {
      name: '',
      status: '접수중', // 필요시 '접수대기'로도 가능
      description: '',
      startDate: '',
      regDate: '',
      location: '',
      scale: 0,
      organizer: '',
      sponsor: '',
      image: '',
      isPublished: true,
    },
  })

  const addCourse = () => {
    if (newCourse.trim() && !courses.includes(newCourse.trim())) {
      setCourses([...courses, newCourse.trim()])
      setNewCourse('')
    }
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: MarathonAddForm) => {
    try {
      setIsLoading(true)
      const result = await createMarathon({
        ...data,
        courses,
        highlights,
        numViews: 0,
        numLikes: 0,
      })

      if (result.success) {
        toast.success('마라톤 대회가 성공적으로 생성되었습니다.')
        // 새로 생성된 마라톤의 ID를 받아서 목록을 새로고침하도록 함
        if (result.marathonId) {
          // 목록 새로고침을 위해 부모 컴포넌트에 알림
          onAdd({
            _id: result.marathonId.toString(),
            ...data,
            courses,
            highlights,
            numViews: 0,
            numLikes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Marathon)
        }
        handleDialogClose(false)
        // 폼 초기화
        form.reset()
        setCourses([])
        setHighlights([])
        setNewCourse('')
        setNewHighlight('')
      } else {
        toast.error('마라톤 대회 생성에 실패했습니다.', {
          description: result.message,
        })
      }
    } catch (error) {
      console.error('마라톤 생성 중 오류:', error)
      toast.error('마라톤 대회 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // 폼 초기화
      form.reset()
      setCourses([])
      setHighlights([])
      setNewCourse('')
      setNewHighlight('')
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-blue-700 justify-center gap-1 text-xl'>
            <Panda className='h-5 w-5' />
            마라톤 대회 추가
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            새로운 마라톤 대회를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2 py-6'>
              {/* 대회명 */}
              <div className='flex items-center gap-2'>
                <Trophy className='h-4 w-4 text-yellow-600 flex-shrink-0' />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='상태를 선택하세요' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='접수중'>접수중</SelectItem>
                                <SelectItem value='접수마감'>
                                  접수마감
                                </SelectItem>
                                <SelectItem value='접수대기'>
                                  접수대기
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                <Calendar className='h-4 w-4 text-orange-600 flex-shrink-0' />
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
                              placeholder='참가자 규모를 입력하세요'
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
                <Heart className='h-4 w-4 text-pink-600 flex-shrink-0' />
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
                <Route className='h-4 w-4 text-orange-600 mt-1.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <div className='flex flex-row items-start gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-2'>
                      코스
                    </FormLabel>
                    <div className='flex-[8_8_0%]'>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='코스를 입력하세요'
                            value={newCourse}
                            onChange={(e) => setNewCourse(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                            onKeyUp={(e) => {
                              if (e.key === 'Enter') {
                                if (
                                  newCourse.trim() &&
                                  !courses.includes(newCourse.trim())
                                ) {
                                  setCourses([...courses, newCourse.trim()])
                                  setNewCourse('')
                                }
                              }
                            }}
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
                <Star className='h-4 w-4 text-yellow-500 mt-1.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <div className='flex flex-row items-start gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-2'>
                      주요 특징
                    </FormLabel>
                    <div className='flex-[8_8_0%]'>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='주요 특징을 입력하세요'
                            value={newHighlight}
                            onChange={(e) => setNewHighlight(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                            onKeyUp={(e) => {
                              if (e.key === 'Enter') {
                                const trimmedValue = newHighlight.trim()
                                if (
                                  trimmedValue &&
                                  !highlights.includes(trimmedValue)
                                ) {
                                  setHighlights([...highlights, trimmedValue])
                                  setNewHighlight('')
                                }
                              }
                            }}
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
                <FileText className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <div className='flex flex-row items-start gap-2 w-full mb-0'>
                    <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3 mt-1'>
                      설명
                    </FormLabel>
                    <div className='flex-[8_8_0%]'>
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder='대회 설명을 입력하세요'
                                {...field}
                                className='min-h-[80px] resize-none'
                              />
                            </FormControl>
                            <FormMessage className='mt-2' />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />

              {/* 게시 여부 */}
              <div className='flex items-center gap-2'>
                <Eye className='h-4 w-4 text-purple-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='isPublished'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          게시 여부
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <div className='flex items-center justify-end gap-2'>
                              <span className='text-sm text-muted-foreground'>
                                {field.value ? '게시' : '비게시'}
                              </span>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className='mt-2' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className='sm:justify-center border-t pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-700 hover:bg-blue-800'
              >
                {isLoading ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    추가 중...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4' />
                    마라톤 추가
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
