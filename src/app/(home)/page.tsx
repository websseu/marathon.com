import React from 'react'
import HomeHeader from '@/components/home/home-header'
import HomePageView from '@/components/home/home-page-view'
import HomeMarathon from '@/components/home/home-marathon'
import {
  getAllMarathonsPage,
  getMarathonStats,
} from '@/lib/actions/marathon.action'

export default async function HomePage(props: {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
    month?: string
  }>
}) {
  const params = await props.searchParams
  const page = Number.parseInt(params.page || '1')
  const search = params.search || ''
  const status = params.status || 'all'
  const month = params.month || ''

  // 통계 데이터 가져오기
  const statsResult = await getMarathonStats()
  const stats = statsResult?.stats ?? {
    total: 0,
    accepting: 0,
    closed: 0,
    waiting: 0,
  }

  // 마라톤 데이터 가져오기
  const result = await getAllMarathonsPage(page, 100, search, status, month)
  const marathons = result.success ? result.marathons : []

  return (
    <>
      {/* 마라톤 헤더 */}
      <HomeHeader stats={stats} />

      {/* 마라톤 검색 */}
      {/* <HomeSearch /> */}

      {/* 마라톤 페이지 설정 */}
      {marathons.length > 10 && <HomePageView />}

      {/* 마라톤 정보 섹션 */}
      <HomeMarathon marathons={marathons} />
    </>
  )
}
