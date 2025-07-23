'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Favorite from '../db/models/favorite.model'
import Marathon from '../db/models/marathon.model'

// 1. toggleFavorite : 즐겨찾기 토글(추가/제거)
// 2. getFavoriteStatus : 사용자의 즐겨찾기 상태 확인

// 즐겨찾기 토글(추가/제거)
export async function toggleFavorite(userId: string, marathonId: string) {
  try {
    // MongoDB 연결
    await connectToDatabase()

    // 기존 즐겨찾기 확인
    const existingFavorite = await Favorite.findOne({ userId, marathonId })

    if (existingFavorite) {
      // 즐겨찾기 제거
      await Favorite.findByIdAndDelete(existingFavorite._id)

      // 마라톤 즐겨찾기 수 감소
      await Marathon.findByIdAndUpdate(marathonId, {
        $inc: { numLikes: -1 },
      })

      revalidatePath('/')
      revalidatePath('/records')

      return {
        success: true,
        isFavorited: false,
        message: '즐겨찾기에서 제거되었습니다.',
      }
    } else {
      // 즐겨찾기 추가
      await Favorite.create({
        userId,
        marathonId,
        isNotificationEnabled: true,
      })

      // 마라톤 즐겨찾기 수 증가
      await Marathon.findByIdAndUpdate(marathonId, {
        $inc: { numLikes: 1 },
      })

      revalidatePath('/')
      revalidatePath('/records')

      return {
        success: true,
        isFavorited: true,
        message: '즐겨찾기에 추가되었습니다.',
      }
    }
  } catch (error) {
    console.error('즐겨찾기 토글 오류:', error)
    return {
      success: false,
      error: '즐겨찾기 처리 중 오류가 발생했습니다.',
    }
  }
}

// 사용자의 즐겨찾기 상태 확인
export async function getFavoriteStatus(userId: string, marathonId: string) {
  try {
    await connectToDatabase()

    const favorite = await Favorite.findOne({ userId, marathonId })

    return {
      success: true,
      isFavorited: !!favorite,
      favoriteInfo: favorite ? JSON.parse(JSON.stringify(favorite)) : null,
    }
  } catch (error) {
    console.error('즐겨찾기 상태 확인 오류:', error)
    return { success: false, isFavorited: false, favoriteInfo: null }
  }
}

// 사용자의 즐겨찾기 목록 조회
export async function getUserFavoriteList(userId: string) {
  try {
    await connectToDatabase()

    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'marathonId',
        match: { isPublished: true },
        select: 'name slug status startDate location courses scale image',
      })
      .sort({ createdAt: -1 })
      .lean()

    // marathon이 null인 경우 필터링 (삭제된 마라톤)
    const validFavorites = favorites.filter((fav) => fav.marathonId !== null)

    // 데이터 변환
    const marathons = validFavorites.map((fav) => ({
      _id: fav.marathonId._id.toString(),
      name: fav.marathonId.name,
      slug: fav.marathonId.slug,
      status: fav.marathonId.status,
      startDate: fav.marathonId.startDate,
      location: fav.marathonId.location,
      courses: fav.marathonId.courses,
      scale: fav.marathonId.scale,
      image: fav.marathonId.image || '/marathon/default.jpg',
    }))

    return {
      success: true,
      marathons,
    }
  } catch (error) {
    console.error('즐겨찾기 목록 조회 오류:', error)
    return {
      success: false,
      marathons: [],
      error: '즐겨찾기 목록을 불러오는데 실패했습니다.',
    }
  }
}
