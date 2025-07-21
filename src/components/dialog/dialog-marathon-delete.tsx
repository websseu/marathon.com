import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface Marathon {
  _id: string
  name: string
  status: string
  startDate: string
  location: string
}

interface DialogMarathonDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  marathon: Marathon | null
  onConfirm: () => void
  isDeleting: boolean
}

export default function DialogMarathonDelete({
  open,
  onOpenChange,
  marathon,
  onConfirm,
  isDeleting,
}: DialogMarathonDeleteProps) {
  if (!marathon) return null

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>마라톤 대회 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{marathon.name}&rdquo; 마라톤 대회를 삭제하시겠습니까?
            <span className='text-destructive block pt-1'>
              이 작업은 되돌릴 수 없습니다.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className='bg-destructive text-white hover:bg-destructive/90'
          >
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
