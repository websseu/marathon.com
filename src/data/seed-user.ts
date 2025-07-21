import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { userData } from './data-user'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    // 기존 데이터 확인
    const existingUsers = await User.find({})
    console.log(`기존 사용자 수: ${existingUsers.length}`)

    // 새로운 데이터만 추가 (중복 이메일 체크)
    const newUsers = []
    for (const userDataItem of userData) {
      const existingUser = await User.findOne({ email: userDataItem.email })
      if (!existingUser) {
        newUsers.push(userDataItem)
      } else {
        console.log(`이미 존재하는 사용자: ${userDataItem.email}`)
      }
    }

    let createdUser = []
    if (newUsers.length > 0) {
      createdUser = await User.insertMany(newUsers)
      console.log(`새로 추가된 사용자 수: ${createdUser.length}`)
    } else {
      console.log('추가할 새로운 사용자가 없습니다.')
    }

    console.log({
      createdUser,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
