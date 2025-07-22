import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '../ui/badge'
import { dday, getStatusBadgeStyle } from '@/lib/utils'
import { Marathon } from '@/lib/type'

interface Props {
  marathons: Marathon[]
}

export default function HomeMarathonText({ marathons }: Props) {
  return (
    <div className='rounded border font-nanum'>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>번호</TableHead>
            <TableHead>대회명</TableHead>
            <TableHead className='text-center'>디데이</TableHead>
            <TableHead>대회 날짜</TableHead>
            <TableHead>접수 상태</TableHead>
            <TableHead>접수 날짜</TableHead>
            <TableHead>장소</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marathons.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className='text-center py-6 text-muted-foreground'
              >
                등록된 마라톤 대회가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            marathons.map((marathon: Marathon, index: number) => {
              const startDisplay = marathon.startDate.substring(0, 13)
              const regDisplay = marathon.regDate
                ? marathon.regDate.substring(0, 13)
                : ''

              return (
                <TableRow key={marathon._id}>
                  <TableCell className='text-center'>{index + 1}</TableCell>
                  <TableCell className='font-medium'>{marathon.name}</TableCell>
                  <TableCell>
                    <Badge className='bg-transparent border-red-500 text-red-500'>
                      {dday(marathon.startDate)}
                    </Badge>
                  </TableCell>
                  <TableCell>{startDisplay}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(marathon.status)}>
                      {marathon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{regDisplay}</TableCell>
                  <TableCell>{marathon.location}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
