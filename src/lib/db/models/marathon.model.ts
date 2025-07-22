import { Schema, Document, model, models } from 'mongoose'

export interface IMarathon extends Document {
  status: string
  name: string
  slug: string
  description: string
  startDate: string
  regDate: string
  location: string
  courses: string[]
  scale: number
  organizer: string
  sponsor: string
  highlights: string[]
  image?: string
  home?: string
  isPublished: boolean
  numViews: number
  numLikes: number
  createdAt: Date
  updatedAt: Date
}

const MarathonSchema = new Schema<IMarathon>(
  {
    status: { type: String, enum: ['접수중', '접수마감', '접수대기'] },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: String },
    regDate: { type: String },
    location: { type: String, trim: true },
    courses: { type: [String], default: [] },
    scale: { type: Number, trim: true },
    organizer: { type: String, trim: true },
    sponsor: { type: String, trim: true },
    highlights: { type: [String], default: [] },
    image: { type: String, default: '/marathon/default.jpg' },
    home: { type: String },
    isPublished: { type: Boolean, default: true },
    numViews: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// 인덱스 설정
MarathonSchema.index({ name: 'text', description: 'text' })
MarathonSchema.index({ status: 1 })
MarathonSchema.index({ location: 1 })
MarathonSchema.index({ startDate: 1 })
MarathonSchema.index({ isPublished: 1 })
MarathonSchema.index({ createdAt: -1 })

const Marathon = models.Marathon || model<IMarathon>('Marathon', MarathonSchema)

export default Marathon
