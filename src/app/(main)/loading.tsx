import { BidetLoader } from '@/components/bidet-loader'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <BidetLoader />
    </div>
  )
}
