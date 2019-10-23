import * as React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { useDebounce } from 'use-debounce'

import { WorkingDataset } from '../models/store'
import { ApiActionThunk } from '../store/api'

const DEBOUNCE_TIMER = 1000

export interface ReadmeProps {
  peername: string
  path: string
  name: string
  value: string
  history: boolean
  workingDataset: WorkingDataset
  write: (peername: string, name: string, dataset: any) => ApiActionThunk
}

const Readme: React.FunctionComponent<ReadmeProps> = (props) => {
  const { value, peername, name, write } = props

  const [internalValue, setInternalValue] = React.useState(value)
  const [debouncedValue] = useDebounce(internalValue, DEBOUNCE_TIMER)

  React.useEffect(() => {
    if (debouncedValue !== value) {
      write(peername, name, {
        readme: internalValue
      })
    }
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setInternalValue(value)
  }

  const getPreview = () => {
    return '<h1>This is a header 1</h1>\n<p>This is a paragraph</p>'
  }

  return (
    <SimpleMDE
      id="readme-editor"
      value={value}
      onChange={handleChange}
      options={{
        spellChecker: false,
        toolbar: [
          'preview',
          'bold',
          'italic',
          'strikethrough',
          'heading',
          '|',
          'code',
          'quote',
          '|',
          'link',
          'image',
          'table',
          '|',
          'unordered-list',
          'ordered-list'
        ],
        status: false,
        placeholder: 'Start writing your readme here',
        previewRender: getPreview
      }}
    />
  )
}

export default Readme
