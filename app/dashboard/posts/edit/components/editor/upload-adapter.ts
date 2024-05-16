import { createClient } from '@/supabase/client'

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  upload() {
    // const formData = new FormData()
    const supabase = createClient()

    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          // formData.append('upload', file, file.name)

          console.log(file)
          const fileName = file.name // 'Image.jpg'
          // const fileSize = file.size // 20051
          // const fileType = file.type // "image/jpeg"

          const { data, error } = supabase.storage
            .from('aaa65025-8ef8-4c3d-929e-c1dcfaa0e964')
            .upload(`public/${fileName}`, file)

          console.log(data)

          const publicUrl = supabase.storage
            .from('aaa65025-8ef8-4c3d-929e-c1dcfaa0e964')
            .getPublicUrl(`${data?.path}`)

          console.log(publicUrl)

          if (error) {
            reject(`Couldn't upload file: ${fileName}.`)
          } else {
            this.loader.uploaded = true
            resolve({ default: publicUrl })
          }

          // return result

          // TypeError: supabase.storage.from(...).upload(...).getPublicUrl is not a function

          // return fetch('https://example.com/files/upload', {
          //   method: 'POST',
          //   // headers: {
          //   //   Authorization: `token ${yourToken}`,
          //   // },
          //   body: formData,
          // })
          //   .then((res) => res.json())
          //   .then((d) => {
          //     if (d.url) {
          //       this.loader.uploaded = true
          //       resolve({
          //         default: d.url,
          //       })
          //     } else {
          //       reject(`Couldn't upload file: ${file.name}.`)
          //     }
          //   })
        })
    )
  }
}

export function MyUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader)
  }
}
