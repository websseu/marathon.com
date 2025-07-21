import { Button } from '../ui/button'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface AdminPaginationProps {
  pagination: PaginationInfo | null
  currentPage: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({
  pagination,
  currentPage,
  onPageChange,
}: AdminPaginationProps) {
  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    if (!pagination) return null

    const buttons = []
    const { currentPage, totalPages } = pagination

    // 이전 페이지들
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 p-0 ${
            i === currentPage ? 'bg-blue-600 hover:bg-blue-700' : ''
          }`}
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <div className='flex justify-center items-center gap-2 mt-12 mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(1)}
            disabled={!pagination.hasPrevPage}
            className='w-8 h-8 p-0'
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className='w-8 h-8 p-0'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <div className='flex gap-1'>{renderPaginationButtons()}</div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className='w-8 h-8 p-0'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            className='w-8 h-8 p-0'
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
