import { z } from 'zod'
import {
  ContactSchema,
  EmailOnlySchema,
  MarathonInputSchema,
  MarathonUpdateSchema,
  PasswordResetSchema,
  TermsAgreementSchema,
  UserEditSchema,
  UserSignInSchema,
  UserSignUpSchema,
  VerifyEmailSchema,
} from './validator'

// 문의사항
export type IContactInput = z.infer<typeof ContactSchema>

// 회원가입
export type ITermsAgreementInput = z.infer<typeof TermsAgreementSchema>
export type IEmailOnlyInput = z.infer<typeof EmailOnlySchema>
export type IVerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type IUserSignUpInput = z.infer<typeof UserSignUpSchema>

// 로그인
export type IUserSignInInput = z.infer<typeof UserSignInSchema>

// 비밀번호 리셋
export type IPasswordResetInput = z.infer<typeof PasswordResetSchema>

// 회원정보 수정
export type UserEditInput = z.infer<typeof UserEditSchema>

// 마라톤 대회 등록
export type IMarathonInput = z.infer<typeof MarathonInputSchema>

// 마라톤 대회 수정
export type IMarathonUpdateInput = z.infer<typeof MarathonUpdateSchema>

// 마라톤 타입
export interface Marathon {
  _id: string
  name: string
  slug: string
  status: string
  startDate: string
  regDate: string
  location: string
  courses: string[]
  scale: number
  description: string
  highlights: string[]
  image: string
  numLikes: number
}
