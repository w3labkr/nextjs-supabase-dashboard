declare module '@ckeditor/ckeditor5-react' {
  import { ClassicEditor } from 'ckeditor5'
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig'
  import Event from '@ckeditor/ckeditor5-utils/src/eventinfo'
  import * as React from 'react'
  const CKEditor: React.FunctionComponent<{
    editor: typeof ClassicEditor
    config?: EditorConfig
    onReady?: (editor: ClassicEditor) => void
    onChange?: (event: Event, editor: ClassicEditor) => void
    onBlur?: (event: Event, editor: ClassicEditor) => void
    onFocus?: (event: Event, editor: ClassicEditor) => void
    onError?: (event: Event, editor: ClassicEditor) => void
  }>
  export { CKEditor }
}
