'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Link as LinkIcon, Panda, Share2 } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  url: string
  title?: string
  triggerClassName?: string
}

export default function ShareDialog({ url, title = '공유하기', triggerClassName }: Props) {
  const [open, setOpen] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사되었습니다.')
    } catch {
      toast.error('복사에 실패했습니다.')
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        setOpen(false)
      } catch {
        /* 취소 or 실패 */
      }
    } else {
      toast.info('이 브라우저는 Web Share를 지원하지 않습니다.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className={triggerClassName}>
          <Share2 className='h-5 w-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='border-b pb-4'>
          <DialogTitle className='flex items-center font-black text-blue-700 justify-center gap-1 text-xl'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            공유하기
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* 링크 표시 & 복사 */}
          <div className='flex gap-2 items-center'>
            <div className='flex items-center gap-1 px-2 py-2.5 rounded border flex-1 overflow-hidden truncate'>
              <LinkIcon className='h-4 w-4 text-muted-foreground shrink-0' />
              <span className='truncate text-sm'>{url}</span>
            </div>
            <Button variant='outline' size='icon' onClick={copyToClipboard}>
              <Copy className='h-4 w-4' />
            </Button>
          </div>

          {/* 네이티브 공유 */}
          <Button onClick={nativeShare} className='w-full' variant='secondary'>
            시스템 공유 사용하기
          </Button>

          {/* 선택: SNS 버튼들 (예시) */}
          <div className='grid grid-cols-3 gap-2 pt-2'>
            <SNSButton
              label='카카오톡'
              href={`https://story.kakao.com/share?url=${encodeURIComponent(url)}`}
            />
            <SNSButton
              label='페이스북'
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            />
            <SNSButton
              label='X(트위터)'
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}&text=${encodeURIComponent(title)}`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SNSButton({ label, href }: { label: string; href: string }) {
  return (
    <Button asChild variant='outline' className='text-xs'>
      <a href={href} target='_blank' rel='noopener noreferrer'>
        {label}
      </a>
    </Button>
  )
}
