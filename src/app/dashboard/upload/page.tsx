import UploadArea from "@/components/upload-area"
import UploadPageFooter from "@/components/upload-page-footer"
import { Suspense } from "react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const folderId = typeof params.folderId === 'string' ? params.folderId : undefined
  
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UploadArea folderId={folderId} />
      </Suspense>
    </div>
  )
}