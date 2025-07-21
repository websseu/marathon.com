import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import { connectToDatabase } from '@/lib/db'

import { marathonData } from './data-marathon'
import Marathon from '@/lib/db/models/marathon.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    await Marathon.deleteMany()
    const createdMarathon = await Marathon.insertMany(marathonData)

    console.log({
      createdMarathon,
      message: '데이터 입력이 완료되었습니다.',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('데이터 입력이 실패하였습니다.')
  }
}

main()
