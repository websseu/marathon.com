import { Schema, model, models, Types } from 'mongoose'

export interface IFavorite extends Document {
  userId: Types.ObjectId
  marathonId: Types.ObjectId
  isNotificationEnabled: boolean
  memo?: string
  createdAt: Date
  updatedAt: Date
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    marathonId: {
      type: Schema.Types.ObjectId,
      ref: 'Marathon',
      required: true,
    },
    isNotificationEnabled: {
      type: Boolean,
      default: true,
    },
    memo: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
)

// 인덱스 설정
FavoriteSchema.index({ userId: 1, createdAt: -1 })
FavoriteSchema.index({ marathonId: 1 })

// 중복 방지를 위한 유니크 인덱스
FavoriteSchema.index({ userId: 1, marathonId: 1 }, { unique: true })

const Favorite = models.Favorite || model<IFavorite>('Favorite', FavoriteSchema)

export default Favorite
