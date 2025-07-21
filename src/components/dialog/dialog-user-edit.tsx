'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Calendar,
  Panda,
  Save,
  Eye,
  BookUser,
} from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import { updateUser } from '@/lib/actions/user.action'
import { UserEditInput } from '@/lib/type'
import { UserEditSchema } from '@/lib/validator'

interface UserType {
  _id: string
  name: string
  username?: string
  email: string
  role?: string
  visitCount: number
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

interface DialogUserEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserType | null
  onUserUpdate: (updatedUser: UserType) => void
}

export default function DialogUserEdit({
  open,
  onOpenChange,
  user,
  onUserUpdate,
}: DialogUserEditProps) {
  const form = useForm<UserEditInput>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: user
      ? {
          name: user.name,
          username: user.username || '',
          email: user.email,
          role: (user.role as 'user' | 'admin') || 'user',
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          visitCount: user.visitCount,
        }
      : {
          name: '',
          username: '',
          email: '',
          role: 'user',
          isActive: true,
          emailVerified: false,
          visitCount: 0,
        },
  })

  // user가 바뀔 때마다 폼 값 동기화
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        username: user.username || '',
        email: user.email,
        role: (user.role as 'user' | 'admin') || 'user',
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        visitCount: user.visitCount,
      })
    }
  }, [user, form])

  const onSubmit = async (data: UserEditInput) => {
    if (!user?._id) return
    try {
      const result = await updateUser(user._id, data)
      if (result.success) {
        toast.success('사용자 정보가 성공적으로 수정되었습니다.')
        onUserUpdate({
          ...user,
          ...data,
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || '사용자 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('사용자 수정 중 오류:', error)
      toast.error('사용자 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(
        user
          ? {
              name: user.name,
              username: user.username || '',
              email: user.email,
              role: (user.role as 'user' | 'admin') || 'user',
              isActive: user.isActive,
              emailVerified: user.emailVerified,
              visitCount: user.visitCount,
            }
          : undefined
      )
    }
    onOpenChange(isOpen)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-blue-700 justify-center gap-1 text-xl'>
            <Panda className='h-5 w-5' />
            사용자 정보 수정
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            사용자 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-2 text-sm max-h-[60vh] overflow-y-auto pt-2'>
              {/* 이름 */}
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          이름
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='이름을 입력하세요'
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

              {/* 이름 */}
              <div className='flex items-center gap-2'>
                <BookUser className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          사용자 이름
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='사용자 이름을 입력하세요'
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

              {/* 이메일 */}
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          이메일
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              placeholder='이메일을 입력하세요'
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

              {/* 역할 */}
              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-purple-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          역할
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Button
                                type='button'
                                variant={
                                  field.value === 'user' ? 'default' : 'outline'
                                }
                                size='sm'
                                onClick={() => field.onChange('user')}
                                className='flex-1'
                              >
                                사용자
                              </Button>
                              <Button
                                type='button'
                                variant={
                                  field.value === 'admin'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='sm'
                                onClick={() => field.onChange('admin')}
                                className='flex-1'
                              >
                                관리자
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

              {/* 계정 상태 */}
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-4 w-4 text-orange-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          계정 상태
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Button
                                type='button'
                                variant={field.value ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => field.onChange(true)}
                                className='flex-1'
                              >
                                활성
                              </Button>
                              <Button
                                type='button'
                                variant={!field.value ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => field.onChange(false)}
                                className='flex-1'
                              >
                                비활성
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

              {/* 이메일 인증 */}
              <div className='flex items-center gap-2'>
                <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='emailVerified'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          이메일 인증
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <div className='flex gap-2'>
                              <Button
                                type='button'
                                variant={field.value ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => field.onChange(true)}
                                className='flex-1'
                              >
                                인증 완료
                              </Button>
                              <Button
                                type='button'
                                variant={!field.value ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => field.onChange(false)}
                                className='flex-1'
                              >
                                인증 필요
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

              {/* 방문 수 */}
              <div className='flex items-center gap-2'>
                <Eye className='h-4 w-4 text-blue-600 flex-shrink-0' />
                <div className='min-w-0 flex-1 mr-1'>
                  <FormField
                    control={form.control}
                    name='visitCount'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center gap-2 w-full mb-0'>
                        <FormLabel className='whitespace-nowrap flex-[2_2_0%] text-right pr-3'>
                          방문 수
                        </FormLabel>
                        <div className='flex-[8_8_0%]'>
                          <FormControl>
                            <Input
                              type='number'
                              min={0}
                              placeholder='방문 수를 입력하세요'
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

              {/* 가입일 (읽기 전용) */}
              <div className='flex items-center justify-start gap-2 pt-2'>
                <Calendar className='h-4 w-4 text-purple-600' />
                <div className='flex items-center'>
                  <span className='whitespace-nowrap text-sm pr-1 font-medium'>
                    가입일 :
                  </span>
                  <span className='text-sm text-gray-900'>
                    {new Date(user.createdAt).toLocaleDateString()}{' '}
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className='sm:justify-center border-t pt-4 mt-4'>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full bg-blue-700 hover:bg-blue-800'
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save /> 사용자 수정
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
