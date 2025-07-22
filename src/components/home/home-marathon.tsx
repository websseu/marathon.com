'use client'

import React, { useState } from 'react'
import { Grid, List } from 'lucide-react'
import { Marathon } from '@/lib/type'
import { Button } from '../ui/button'
import HomeMarathonBox from './home-marathon-box'
import HomeMarathonText from './home-marathon-text'

interface Props {
  marathons: Marathon[]
}

export default function HomeMarathon({ marathons }: Props) {
  const [view, setView] = useState<'box' | 'text'>('box')

  return (
    <>
      {/* 뷰 전환 버튼 */}
      <div className='flex justify-end gap-1 mb-2'>
        <Button
          onClick={() => setView('box')}
          className={`w-8 h-8 ${view === 'box' ? 'bg-blue-50' : ''}`}
          aria-label='카드 형식으로 보기'
          variant='ghost'
        >
          <Grid className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => setView('text')}
          className={`w-8 h-8 ${view === 'text' ? 'bg-blue-50' : ''}`}
          aria-label='테이블 형식으로 보기'
          variant='ghost'
        >
          <List className='h-4 w-4' />
        </Button>
      </div>

      {/* 선택된 뷰에 따라 컴포넌트 렌더링 */}
      {view === 'box' ? (
        <HomeMarathonBox marathons={marathons} />
      ) : (
        <HomeMarathonText marathons={marathons} />
      )}
    </>
  )
}
