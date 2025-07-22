import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { formatDateTime, getStatusBadge } from '@/lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import {
  deleteMarathon,
  getAllMarathonsPage,
  toggleMarathonStatus,
} from '@/lib/actions/marathon.action'
import {
  Loader2,
  Search,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Heart,
  Edit,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AdminPagination from './admin-pagination'
import DialogMarathonDelete from '../dialog/dialog-marathon-delete'
import DialogMarathonDetail from '../dialog/dialog-marathon-detail'
import DialogMarathonEdit from '../dialog/dialog-marathon-edit'
import DialogMarathonAdd from '../dialog/dialog-marathon-add'

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
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function AdminMarathon() {
  const [marathons, setMarathons] = useState<Marathon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [marathonToDelete, setMarathonToDelete] = useState<Marathon | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusChanging, setStatusChanging] = useState<string | null>(null)

  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(
    null
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [marathonToEdit, setMarathonToEdit] = useState<Marathon | null>(null)

  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // 데이터 가져오기
  const fetchMarathons = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getAllMarathonsPage(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined,
        statusFilter === 'all' ? undefined : statusFilter
      )

      if (result.success) {
        // MongoDB ObjectId를 문자열로 변환
        const serializedMarathons = JSON.parse(JSON.stringify(result.marathons))
        setMarathons(serializedMarathons)
        setPagination(result.pagination!)
        setError(null)
      } else {
        setError(result.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
      console.error('마라톤 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter])

  useEffect(() => {
    fetchMarathons()
  }, [fetchMarathons])

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 상태별 통계 계산
  const getStatusCounts = () => {
    return {
      recruiting: marathons.filter((m) => m.status === '접수중').length,
      closed: marathons.filter((m) => m.status === '접수마감').length,
      waiting: marathons.filter((m) => m.status === '접수대기').length,
    }
  }

  const statusCounts = getStatusCounts()

  // 상태 변경
  const handleStatusChange = async (marathon: Marathon) => {
    try {
      setStatusChanging(marathon._id)
      const result = await toggleMarathonStatus(marathon._id)

      if (result.success) {
        toast.success('상태 변경 완료', {
          description: result.message,
        })

        // 목록에서 해당 마라톤의 상태 업데이트
        setMarathons((prevMarathons) =>
          prevMarathons.map((m) =>
            m._id === marathon._id ? { ...m, status: result.status! } : m
          )
        )
      } else {
        toast.error('상태 변경 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('상태 변경 중 오류:', error)
      toast.error('상태 변경 실패', {
        description: '마라톤 상태 변경 중 오류가 발생했습니다.',
      })
    } finally {
      setStatusChanging(null)
    }
  }

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (marathon: Marathon) => {
    setMarathonToDelete(marathon)
    setDeleteDialogOpen(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!marathonToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteMarathon(marathonToDelete._id)

      if (result.success) {
        toast.success('삭제 완료', {
          description: result.message,
        })

        // 목록에서 삭제된 마라톤 제거
        setMarathons((prevMarathons) =>
          prevMarathons.filter(
            (marathon) => marathon._id !== marathonToDelete._id
          )
        )

        // 전체 마라톤 수 감소
        setPagination((prev) =>
          prev ? { ...prev, totalCount: prev.totalCount - 1 } : prev
        )

        if (marathons.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else {
        toast.error('삭제 실패', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      toast.error('삭제 실패', {
        description: '마라톤 삭제 중 오류가 발생했습니다.',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setMarathonToDelete(null)
    }
  }

  // 다이얼로그 닫기
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false)
      setMarathonToDelete(null)
    }
  }

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // 페이지 이동
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // 상세정보 다이얼로그 열기
  const handleDetailClick = (marathon: Marathon) => {
    setSelectedMarathon(marathon)
    setDetailDialogOpen(true)
  }

  // 수정 다이얼로그 열기
  const handleEditClick = (marathon: Marathon) => {
    setMarathonToEdit(marathon)
    setEditDialogOpen(true)
  }

  // 마라톤 정보 업데이트 핸들러
  const handleMarathonUpdate = (updatedMarathon: Marathon) => {
    setMarathons((prev) =>
      prev.map((marathon) =>
        marathon._id === updatedMarathon._id ? updatedMarathon : marathon
      )
    )
  }

  // 마라톤 추가 핸들러
  const handleMarathonAdd = (newMarathon: Marathon) => {
    setMarathons((prev) => [newMarathon, ...prev])
    // 전체 마라톤 수 증가
    setPagination((prev) =>
      prev ? { ...prev, totalCount: prev.totalCount + 1 } : prev
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-gmarket text-blue-700 flex items-center gap-2'>
            마라톤 관리({pagination?.totalCount || 0})
          </CardTitle>
          <CardDescription>
            마라톤을 관리하고 삭제 및 상태 변경을 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* 통계 */}
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-blue-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-700'>
                  {statusCounts.recruiting}
                </div>
                <div className='text-sm text-gray-600'>접수중</div>
              </div>
              <div className='text-center p-4 bg-red-50 rounded-lg'>
                <div className='text-2xl font-bold text-red-700'>
                  {statusCounts.closed}
                </div>
                <div className='text-sm text-gray-600'>접수마감</div>
              </div>
              <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                <div className='text-2xl font-bold text-yellow-700'>
                  {statusCounts.waiting}
                </div>
                <div className='text-sm text-gray-600'>접수대기</div>
              </div>
            </div>

            <div className='flex gap-3 flex-col sm:flex-row justify-between items-end'>
              {/* 검색영역 */}
              <div className='relative w-full sm:w-80 flex gap-2'>
                <Search className='absolute left-3 top-3.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='대회명, 장소, 주최자 검색'
                  className='pl-9 h-11'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='flex gap-1'>
                {/* 상태 필터 */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='상태' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>전체</SelectItem>
                    <SelectItem value='접수중'>접수중</SelectItem>
                    <SelectItem value='접수마감'>접수마감</SelectItem>
                    <SelectItem value='접수대기'>접수대기</SelectItem>
                  </SelectContent>
                </Select>

                {/* 페이지 갯수 설정 */}
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className='w-24'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='10'>10개</SelectItem>
                    <SelectItem value='20'>20개</SelectItem>
                    <SelectItem value='50'>50개</SelectItem>
                  </SelectContent>
                </Select>

                {/* 글쓰기 버튼 */}
                <Button
                  variant='outline'
                  className='h-9'
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Edit className='h-4 w-4' />
                  글쓰기
                </Button>
              </div>
            </div>

            {/* 테이블 */}
            {isLoading ? (
              <div className='flex justify-center items-center py-8 mt-8'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2'>데이터를 불러오는 중...</span>
              </div>
            ) : error ? (
              <div className='bg-destructive/10 p-4 rounded-md text-destructive text-center'>
                <p className='font-medium'>{error}</p>
                <Button
                  onClick={fetchMarathons}
                  variant='outline'
                  className='mt-2'
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              <>
                <div className='rounded border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='text-center'>번호</TableHead>
                        <TableHead>대회명</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>대회 날짜</TableHead>
                        <TableHead>장소</TableHead>
                        <TableHead>규모</TableHead>
                        <TableHead>조회수</TableHead>
                        <TableHead>좋아요</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead className='text-center'>관리</TableHead>
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
                        marathons.map((marathon, index) => {
                          const statusBadge = getStatusBadge(marathon.status)
                          return (
                            <TableRow key={marathon._id}>
                              <TableCell className='text-center'>
                                {(currentPage - 1) * pageSize + index + 1}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {marathon.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={statusBadge.variant}
                                  className={
                                    statusBadge.color +
                                    ' cursor-pointer select-none'
                                  }
                                  onClick={() =>
                                    statusChanging !== marathon._id &&
                                    handleStatusChange(marathon)
                                  }
                                  style={{
                                    opacity:
                                      statusChanging === marathon._id ? 0.6 : 1,
                                  }}
                                  title='클릭 시 상태가 변경됩니다.'
                                >
                                  {statusChanging === marathon._id ? (
                                    <Loader2 className='h-3 w-3 animate-spin mr-1 inline' />
                                  ) : null}
                                  {marathon.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <Calendar className='h-4 w-4 text-gray-500' />
                                  {new Date(
                                    marathon.startDate.split(' ')[0]
                                  ).toLocaleDateString('ko-KR')}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <MapPin className='h-4 w-4 text-gray-500' />
                                  {marathon.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <Users className='h-4 w-4 text-gray-500' />
                                  {marathon.scale.toLocaleString()}명
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <TrendingUp className='h-4 w-4 text-gray-500' />
                                  {marathon.numViews}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <Heart className='h-4 w-4 text-gray-500' />
                                  {marathon.numLikes}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDateTime(marathon.createdAt)}
                              </TableCell>
                              <TableCell className='text-center'>
                                <div className='flex gap-1 justify-center'>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => handleDetailClick(marathon)}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => handleEditClick(marathon)}
                                  >
                                    <Edit className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => handleDeleteClick(marathon)}
                                    disabled={isDeleting}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 페이지네이션 */}
                {pagination && (
                  <AdminPagination
                    pagination={pagination}
                    currentPage={pagination.currentPage}
                    onPageChange={goToPage}
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 삭제 다이얼로그 */}
      <DialogMarathonDelete
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        marathon={marathonToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* 상세보기 다이얼로그 */}
      <DialogMarathonDetail
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        marathon={selectedMarathon}
      />

      {/* 수정 다이얼로그 */}
      <DialogMarathonEdit
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        marathon={marathonToEdit}
        onUpdate={handleMarathonUpdate}
      />

      {/* 추가 다이얼로그 */}
      <DialogMarathonAdd
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleMarathonAdd}
      />
    </>
  )
}
