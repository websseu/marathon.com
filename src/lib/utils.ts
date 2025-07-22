import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 인증번호 생성
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 날짜 생성 2024.04.03 03:11
export function formatDateTime(dateInput: Date | string): string {
  const d = new Date(dateInput)
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${MM}.${dd} ${hh}:${mm}`
}

// 날짜 생성 2024-04-01
export function getDayFormatted(date: Date = new Date()): string {
  const previousDay = new Date(date)
  previousDay.setDate(date.getDate() - 1)

  const year = previousDay.getFullYear()
  const month = String(previousDay.getMonth() + 1).padStart(2, '0')
  const day = String(previousDay.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 디데이 계산
export const getDday = (startDate: string) => {
  const eventDate = new Date(startDate.substring(0, 10))
  const today = new Date()
  eventDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'D-day'
  if (diffDays > 0) return `D-${diffDays}`
  return '종료'
}

export const getDdayStyle = (startDate: string) =>
  getDday(startDate) === '종료'
    ? 'border-gray-400 bg-transparent text-gray-500'
    : 'border-red-600 bg-transparent text-red-600'

export const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case '접수중':
      return 'text-green-600 border-green-600 bg-transparent'
    case '접수대기':
      return 'text-blue-600 border-blue-600 bg-transparent'
    case '접수마감':
      return 'text-red-600 border-red-600 bg-transparent'
    default:
      return 'border-gray-400 bg-transparent text-gray-500'
  }
}

// 상태별 배지 스타일
export const getStatusBadge = (status: string) => {
  switch (status) {
    case '접수중':
      return {
        variant: 'outline' as const,
        color: 'text-green-600 border-green-600',
      }
    case '접수마감':
      return {
        variant: 'outline' as const,
        color: 'text-red-600 border-red-600',
      }
    case '접수대기':
      return {
        variant: 'outline' as const,
        color: 'text-yellow-600 border-yellow-600',
      }
    default:
      return {
        variant: 'outline' as const,
        color: 'text-gray-600',
      }
  }
}
