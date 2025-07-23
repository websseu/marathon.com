'use client'

import { useState, useTransition } from 'react'
import { Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/lib/actions/favorite.action'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  marathonId: string
  userId?: string
  initialFavorited?: boolean
}

export default function FavoriteButton({
  marathonId,
  userId,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()

  const handleToggleFavorite = () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.')
      return
    }

    startTransition(async () => {
      const result = await toggleFavorite(userId, marathonId)

      if (result.success) {
        setIsFavorited(!!result.isFavorited)
        toast.success(result.message)
      } else {
        toast.error(result.error || '오류가 발생했습니다.')
      }
    })
  }

  return (
    <Button
      size='icon'
      variant='noeffect'
      onClick={handleToggleFavorite}
      disabled={isPending}
      className={`transition-all duration-200 bg-blue-50/40 ${
        isFavorited ? 'text-red-500 bg-red-50' : ''
      }`}
    >
      <Award className='h-5 w-5' />
    </Button>
  )
}
