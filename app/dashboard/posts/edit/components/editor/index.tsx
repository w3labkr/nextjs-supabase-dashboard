'use client'

import * as React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'ckeditor5-custom-build'
import type { EditorConfig } from '@ckeditor/ckeditor5-core'
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo'
import { MyUploadAdapterPlugin } from './upload-adapter'

import { defaultLng } from '@/i18next.config'
import { useAppSelector } from '@/lib/redux/hooks'
import { useAuth } from '@/hooks/use-auth'
import { useFormContext } from 'react-hook-form'
import { usePostForm } from '../../post-form-provider'

import '@/ckeditor5/build/translations/ko.js'
import './style.css'

// prettier-ignore
const editorConfiguration: EditorConfig = {
  // Changing the language of the interface requires loading the language file using the <script> tag.
  language: defaultLng,

  // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
  placeholder: 'Welcome to CKEditor 5!',

  // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
  toolbar: {
    items: [
      // 'findAndReplace', 'selectAll', '|',
      'undo', 'redo',
      '|', 'heading',
      '|', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight',
      '|', 'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', 'specialCharacters',
      '|', 'link', 'imageUpload', 'blockQuote', 'codeBlock', 'insertTable',
      // '|', 'mediaEmbed', 'htmlEmbed',
      '|', 'alignment',
      '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
      '|', 'horizontalLine', 'pageBreak',
      // '|', 'textPartLanguage',
      '|', 'sourceEditing'
    ],
    shouldNotGroupWhenFull: true
  },

  // Changing the language of the interface requires loading the language file using the <script> tag.
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },

  // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1', },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2', },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3', },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4', },
      { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5', },
      { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6', },
    ],
  },

  // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
  fontFamily: {
    options: [
      'default',
      'Arial, Helvetica, sans-serif',
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Tahoma, Geneva, sans-serif',
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica, sans-serif',
      'Verdana, Geneva, sans-serif'
    ],
    supportAllValues: true
  },

  // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
  fontSize: {
    options: [10, 12, 14, 'default', 18, 20, 22],
    supportAllValues: true
  },

  // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
  // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
  // htmlSupport: {
  //   allow: [
  //     {
  //       name: /.*/,
  //       attributes: true,
  //       classes: true,
  //       styles: true
  //     }
  //   ]
  // },

  // Be careful with enabling previews
  // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
  // htmlEmbed: {
  //   showPreviews: true
  // },

  // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
  link: {
    decorators: {
      toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
              download: 'file'
          }
      },
      openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          defaultValue: true,			// This option will be selected by default.
          attributes: {
              target: '_blank',
              rel: 'noopener noreferrer'
          }
      }
    }
  },

  // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
  // mention: {
  //   feeds: [
  //     {
  //       marker: '@',
  //       feed: [
  //         '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
  //         '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
  //         '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
  //         '@sugar', '@sweet', '@topping', '@wafer'
  //       ],
  //       minimumCharacters: 1
  //     }
  //   ]
  // },

  removePlugins: [
    'Title',
    'MediaEmbedToolbar', // Warning: widget-toolbar-no-items { toolbarId: 'mediaEmbed' }
  ],

  extraPlugins: [
    MyUploadAdapterPlugin
  ],
}

const Editor = () => {
  const { user } = useAuth()
  const { setValue } = useFormContext()
  const { post } = usePostForm()

  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )

  const content: string = post?.content ?? ''
  const [watchValue, setWatchValue] = React.useState<string>('')

  React.useEffect(() => {
    setValue('content', content)
    setWatchValue(content)
  }, [setValue, content])

  React.useEffect(() => {
    editorConfiguration.language = resolvedLanguage
  }, [resolvedLanguage])

  React.useEffect(() => {
    localStorage.setItem('ckeditor5', JSON.stringify({ userId: user?.id }))
  }, [user?.id])

  const handleChange = (event: EventInfo, editor: ClassicEditor) => {
    const data = editor.getData()
    setValue('content', data)
    setWatchValue(data)
  }

  // This for Revisions
  // const handleBlur = (event: EventInfo, editor: ClassicEditor) => {
  //   console.log('handleBlur')
  //   const data = editor.getData()
  //   console.log(data)
  // }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfiguration}
      data={watchValue}
      onChange={handleChange}
      // onBlur={handleBlur}
    />
  )
}

export default Editor
