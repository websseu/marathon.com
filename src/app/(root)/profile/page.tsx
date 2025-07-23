import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/actions/user.action'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Calendar, User, Mail, Shield, Eye, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserFavoriteList } from '@/lib/actions/favorite.action'
import FavoriteMarathon from '@/components/favorite/favorite-marathon'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/')
  }

  const userId = session.user.id

  const [userResult, favoriteListResult] = await Promise.all([
    getUserById(userId),
    getUserFavoriteList(userId),
  ])

  const user = userResult.success ? userResult.user : null
  const favoriteMarathons = favoriteListResult.success ? favoriteListResult.marathons : []

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <p className='text-red-500'>사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* 사용자 프로필 섹션 */}
      <Card className='mb-8'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold'>내 프로필</CardTitle>
            <Button variant='outline' size='sm' asChild>
              <Link href='/profile/edit'>
                <Settings className='h-4 w-4 mr-2' />
                편집
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* 프로필 이미지 */}
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='w-24 h-24'>
                <AvatarImage src={user.image || '/placeholder.svg'} alt={user.name || '사용자'} />
                <AvatarFallback className='text-2xl'>
                  <User className='h-12 w-12' />
                </AvatarFallback>
              </Avatar>
              <Badge
                variant={user.role === 'admin' ? 'default' : 'secondary'}
                className='flex items-center gap-1'
              >
                <Shield className='h-3 w-3' />
                {user.role === 'admin' ? '관리자' : '일반 사용자'}
              </Badge>
            </div>

            {/* 사용자 정보 */}
            <div className='flex-1 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-500' />
                    <span className='font-medium'>이름:</span>
                    <span>{user.name || '설정되지 않음'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-500' />
                    <span className='font-medium'>이메일:</span>
                    <span className='text-sm'>{user.email}</span>
                  </div>
                  {user.username && (
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>사용자명:</span>
                      <span>@{user.username}</span>
                    </div>
                  )}
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Eye className='h-4 w-4 text-gray-500' />
                    <span className='font-medium'>방문 횟수:</span>
                    <span>{user.visitCount.toLocaleString()}회</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-gray-500' />
                    <span className='font-medium'>가입일:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>이메일 인증:</span>
                    <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
                      {user.emailVerified ? '인증됨' : '미인증'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 즐겨찾기 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Heart className='h-5 w-5 text-red-500' />내 즐겨찾기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FavoriteMarathon marathons={favoriteMarathons} />
          {favoriteMarathons.length === 0 && (
            <div className='text-center py-8'>
              <Heart className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500 mb-4'>아직 즐겨찾기한 마라톤이 없습니다.</p>
              <Button asChild>
                <Link href='/'>마라톤 둘러보기</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
