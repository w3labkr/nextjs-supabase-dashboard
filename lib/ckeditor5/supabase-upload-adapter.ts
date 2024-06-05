import {
  FileLoader,
  UploadResponse,
} from '@ckeditor/ckeditor5-upload/src/filerepository'

import { createClient } from '@/supabase/client'

// https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/upload-adapter.html
// https://ckeditor.com/docs/ckeditor5/latest/api/module_upload_filerepository-FileLoader.html
class SupabaseUploadAdapter {
  loader: FileLoader

  constructor(loader: FileLoader) {
    // The file loader instance to use during the upload. It sounds scary but do not
    // worry — the loader will be passed into the adapter later on in this guide.
    this.loader = loader
  }

  // Starts the upload process.
  upload(): Promise<UploadResponse> {
    return this.loader.file.then((file: File | null) => {
      return new Promise((resolve, reject) => {
        const raw: string = localStorage.getItem('ckeditor5') ?? '{}'
        const storage: Record<string, any> = JSON.parse(raw)

        const supabase = createClient()
        const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
        const filePath = `${storage?.userId}/${file?.name}`

        if (file) {
          supabase.storage
            .from(bucketId)
            .upload(filePath, file, { upsert: true })
            .then((uploaded) => {
              if (uploaded?.error) {
                reject('The file cannot be uploaded.')
              } else {
                const result = supabase.storage
                  .from(bucketId)
                  .getPublicUrl(uploaded?.data?.path)
                this.loader.uploaded = file?.size
                resolve({ default: result?.data?.publicUrl })
              }
            })
        } else {
          reject('File not found.')
        }
      })
    })
  }
}

export function SupabaseUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new SupabaseUploadAdapter(loader)
  }
}
