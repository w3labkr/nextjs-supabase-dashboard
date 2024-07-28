'use client'

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
        const supabase = createClient()

        const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
        const folder = globalThis.localStorage.getItem('ckeditor5:uploadFolder')
        const path = folder && file?.name ? `${folder}/${file?.name}` : null

        if (file && path) {
          supabase.storage
            .from(bucketId)
            .upload(path, file, { upsert: true })
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
