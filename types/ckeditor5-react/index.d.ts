declare module '@ckeditor/ckeditor5-react' {
  import ClassicEditor from 'ckeditor5-custom-build'
  import Event from '@ckeditor/ckeditor5-utils/src/eventinfo'
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig'
  import * as React from 'react'
  const CKEditor: React.FunctionComponent<{
    disabled?: boolean
    editor: typeof ClassicEditor
    data?: string
    id?: string
    config?: EditorConfig
    onReady?: (editor: ClassicEditor) => void
    onChange?: (event: Event, editor: ClassicEditor) => void
    onBlur?: (event: Event, editor: ClassicEditor) => void
    onFocus?: (event: Event, editor: ClassicEditor) => void
    onError?: (event: Event, editor: ClassicEditor) => void
  }>
  export { CKEditor }
}
