'use server'

import Marathon from '../db/models/marathon.model'
import { connectToDatabase } from '../db'
import { IMarathonInput, IMarathonUpdateInput } from '../type'
import { MarathonInputSchema, MarathonUpdateSchema } from '../validator'
import { revalidatePath } from 'next/cache'

// 1. createMarathon : 마라톤 대회 등록
// 2. getAllMarathons : 마라톤 대회 목록 조회
// 3. getAllMarathonsPage : 마라톤 대회 목록 조회(페이지, 검색)
// 4. getMarathonById : 마라톤 대회 상세 조회
// 5. updateMarathon : 마라톤 대회 수정
// 6. deleteMarathon : 마라톤 대회 삭제
// 7. toggleMarathonStatus : 마라톤 대회 상태 토글
// 8. incrementViews : 조회수 증가
// 9. toggleLike : 좋아요 토글

// 마라톤 대회 등록
export async function createMarathon(formData: IMarathonInput) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // Zod 스키마로 입력 검증
    const parsedData = await MarathonInputSchema.parseAsync(formData)

    // 마라톤 대회 저장
    const newMarathon = await Marathon.create(parsedData)

    // 캐시 갱신
    revalidatePath('/')

    // 성공 응답 반환
    return {
      success: true,
      message: '마라톤 대회가 성공적으로 등록되었습니다.',
      marathonId: newMarathon._id.toString(),
    }
  } catch (err) {
    console.error('마라톤 대회 등록 중 오류 발생:', err)
    // 실패 응답 반환
    return {
      success: false,
      message: '마라톤 대회 등록 중 오류가 발생했습니다.',
    }
  }
}

// 마라톤 대회 목록 조회
export async function getAllMarathons() {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 모든 마라톤 대회 조회 (발행된 것만)
    const marathons = await Marathon.find({ isPublished: true }).sort({ createdAt: -1 }).lean()

    // JSON 직렬화
    const serialized = JSON.parse(JSON.stringify(marathons))

    return {
      success: true,
      marathons: serialized,
    }
  } catch (error) {
    console.error('마라톤 대회 목록 조회 중 오류 발생:', error)

    return {
      success: false,
      error: '마라톤 대회 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

export async function getAllMarathonsPage(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  month?: string
) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    // 검색 조건 설정
    const searchCondition: {
      isPublished?: boolean
      $or?: Array<Record<string, { $regex: string; $options: string }>>
      status?: string
      startDate?: { $gte: Date; $lte: Date }
    } = { isPublished: true }

    // 검색어가 있고 빈 문자열이 아닐 때만 검색 조건 추가
    if (search && search.trim() !== '') {
      searchCondition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }

    // 월별 필터링 (해당 월의 접수중인 대회만)
    if (month && month !== '') {
      const monthNum = Number.parseInt(month)
      const year = new Date().getFullYear()
      const startOfMonth = new Date(year, monthNum - 1, 1)
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59)

      searchCondition.startDate = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      }
    } else if (status && status !== 'all') {
      // 상태 필터가 있고 'all'이 아닐 때만 상태 조건 추가
      searchCondition.status = status
    }

    // 총 개수 조회
    const totalCount = await Marathon.countDocuments(searchCondition)

    // 페이지네이션된 데이터 조회
    const marathons = await Marathon.find(searchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      success: true,
      marathons: JSON.parse(JSON.stringify(marathons)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    }
  } catch (error) {
    console.error('마라톤 대회 조회 오류:', error)
    return {
      success: false,
      error: '마라톤 대회 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 통계 데이터 조회 함수 추가
export async function getMarathonStats() {
  try {
    await connectToDatabase()

    const [total, accepting, closed, waiting] = await Promise.all([
      Marathon.countDocuments({ isPublished: true }),
      Marathon.countDocuments({ isPublished: true, status: '접수중' }),
      Marathon.countDocuments({ isPublished: true, status: '접수마감' }),
      Marathon.countDocuments({ isPublished: true, status: '접수대기' }),
    ])

    return {
      success: true,
      stats: {
        total,
        accepting,
        closed,
        waiting,
      },
    }
  } catch (error) {
    console.error('통계 데이터 조회 오류:', error)
    return {
      success: false,
      error: '통계 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 마라톤 대회 상세 조회
export async function getMarathonById(marathonId: string) {
  try {
    await connectToDatabase()

    const marathon = await Marathon.findById(marathonId).lean()

    if (!marathon) {
      return {
        success: false,
        error: '마라톤 대회를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      marathon: JSON.parse(JSON.stringify(marathon)),
    }
  } catch (error) {
    console.error('마라톤 대회 상세 조회 오류:', error)
    return {
      success: false,
      error: '마라톤 대회 정보를 불러오는데 실패했습니다.',
    }
  }
}

// 마라톤 대회 슬러그로 상세 조회
export async function getMarathonBySlug(slug: string) {
  try {
    await connectToDatabase()

    // slug는 unique라고 가정
    const marathon = await Marathon.findOne({ slug, isPublished: true }).lean()

    if (!marathon) {
      return {
        success: false,
        error: '마라톤 대회를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      marathon: JSON.parse(JSON.stringify(marathon)),
    }
  } catch (error) {
    console.error('마라톤 대회 슬러그 조회 오류:', error)
    return {
      success: false,
      error: '마라톤 대회 정보를 불러오는데 실패했습니다.',
    }
  }
}

// 마라톤 대회 수정
export async function updateMarathon(marathonId: string, updateData: IMarathonUpdateInput) {
  try {
    await connectToDatabase()

    // Zod 스키마로 입력 검증
    const parsedData = await MarathonUpdateSchema.parseAsync({
      ...updateData,
      id: marathonId,
    })

    // 마라톤 대회 존재 확인
    const existingMarathon = await Marathon.findById(marathonId)
    if (!existingMarathon) {
      return {
        success: false,
        error: '수정할 마라톤 대회를 찾을 수 없습니다.',
      }
    }

    // 마라톤 대회 수정
    const updatedMarathon = await Marathon.findByIdAndUpdate(
      marathonId,
      { ...parsedData, updatedAt: new Date() },
      { new: true }
    )

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '마라톤 대회가 성공적으로 수정되었습니다.',
      marathon: JSON.parse(JSON.stringify(updatedMarathon)),
    }
  } catch (error) {
    console.error('마라톤 대회 수정 중 오류 발생:', error)
    return {
      success: false,
      error: '마라톤 대회 수정 중 오류가 발생했습니다.',
    }
  }
}

// 마라톤 대회 삭제
export async function deleteMarathon(marathonId: string) {
  try {
    // 데이터베이스 연결
    await connectToDatabase()

    // 마라톤 대회 ID 유효성 검사
    if (!marathonId) {
      return {
        success: false,
        error: '삭제할 마라톤 대회 ID가 필요합니다.',
      }
    }

    // 마라톤 대회 존재 확인
    const existingMarathon = await Marathon.findById(marathonId)
    if (!existingMarathon) {
      return {
        success: false,
        error: '삭제하려는 마라톤 대회를 찾을 수 없습니다.',
      }
    }

    // 마라톤 대회 삭제
    await Marathon.findByIdAndDelete(marathonId)

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '마라톤 대회가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    console.error('마라톤 대회 삭제 중 오류 발생:', error)

    return {
      success: false,
      error: '마라톤 대회 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 마라톤 대회 상태 토글
export async function toggleMarathonStatus(marathonId: string) {
  try {
    await connectToDatabase()

    const marathon = await Marathon.findById(marathonId)
    if (!marathon) {
      return {
        success: false,
        error: '마라톤 대회를 찾을 수 없습니다.',
      }
    }

    // 상태 토글
    const newStatus = marathon.status === '접수중' ? '접수마감' : '접수중'
    marathon.status = newStatus
    await marathon.save()

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: `마라톤 대회 상태가 '${newStatus}'로 변경되었습니다.`,
      status: newStatus,
    }
  } catch (error) {
    console.error('마라톤 대회 상태 변경 중 오류 발생:', error)
    return {
      success: false,
      error: '마라톤 대회 상태 변경 중 오류가 발생했습니다.',
    }
  }
}

// 조회수 증가
export async function incrementViews(marathonId: string) {
  try {
    await connectToDatabase()

    await Marathon.findByIdAndUpdate(marathonId, { $inc: { numViews: 1 } }, { new: true })

    return { success: true }
  } catch (error) {
    console.error('조회수 증가 오류:', error)
    return { success: false }
  }
}

// 좋아요 토글
export async function toggleLike(marathonId: string) {
  try {
    await connectToDatabase()

    const marathon = await Marathon.findById(marathonId)
    if (!marathon) {
      return {
        success: false,
        error: '마라톤 대회를 찾을 수 없습니다.',
      }
    }

    // 좋아요 토글 (임시로 1씩 증가/감소)
    marathon.numLikes += 1
    await marathon.save()

    // 캐시 갱신
    revalidatePath('/')

    return {
      success: true,
      message: '좋아요가 추가되었습니다.',
      numLikes: marathon.numLikes,
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error)
    return {
      success: false,
      error: '좋아요 처리 중 오류가 발생했습니다.',
    }
  }
}
