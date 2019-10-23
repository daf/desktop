import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

import Toast, { ToastTypes } from './chrome/Toast'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import HandsonTable from './HandsonTable'
import { ApiAction } from '../store/api'

import { PageInfo, WorkingDataset } from '../models/store'
import { VariableSizeList as List } from 'react-window'

require('codemirror/mode/javascript/javascript')

export interface BodyProps {
  workingDataset: WorkingDataset
  peername: string
  name: string
  path: string
  value: any[]
  pageInfo: PageInfo
  history: boolean
  format: string
  fetchBody: (page?: number, pageSize?: number) => Promise<ApiAction>
  fetchCommitBody: (page?: number, pageSize?: number) => Promise<ApiAction>
  height: number | null
  width: number | null
}

function shouldDisplayTable (value: any[] | Object, format: string) {
  return value && (format === 'csv' || format === 'xlsx')
}

const extractColumnHeaders = (workingDataset: WorkingDataset): undefined | object => {
  const structure = workingDataset.components.structure.value
  const schema = structure.schema

  if (!schema) {
    return undefined
  }

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema && schema.items && schema.items.items.map((d: { title: string }): string => d.title)
}

interface ItemProps {
  index: number
  style: object
  data: any
}

const Item: React.FunctionComponent<ItemProps> = (props: ItemProps) => {
  const { index, style, data } = props
  const item = data[index]
  return (
    <pre style={style}>
      {JSON.stringify(item, null, 2)}
    </pre>
  )
}

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    value,
    pageInfo,
    workingDataset,
    history,
    fetchBody,
    format,
    fetchCommitBody,
    height,
    width
  } = props

  console.log('HERE', height, width)
  const isLoadingFirstPage = (pageInfo.page === 1 && pageInfo.isFetching)

  const handleScrollToBottom = () => {
    const onFetch = history ? fetchCommitBody : fetchBody
    onFetch(pageInfo.page + 1, pageInfo.pageSize)
  }

  const headers = extractColumnHeaders(workingDataset)

  return (
    <div className='transition-group'>
      <CSSTransition
        in={!isLoadingFirstPage}
        timeout={300}
        classNames='fade'
      >
        <div id='transition-wrap'>
          {shouldDisplayTable(value, format)
            ? <HandsonTable
              headers={headers}
              body={value}
              onScrollToBottom={handleScrollToBottom}
            />
            : (
              <List
                height={height || 0}
                itemCount={value.length}
                itemData={value}
                itemSize={(index) => {
                  const lineHeight = 22
                  const item = value[index]
                  const text = JSON.stringify(item, null, 2)
                  const match = text.match(/[^\n]*\n[^\n]*/gi)
                  const lineCount = match ? match.length + 1 : 1
                  return lineCount * lineHeight
                }}
                width={width || 0}
              >
                {Item}
              </List>
            )

          }
          <Toast
            show={pageInfo.isFetching && pageInfo.page > 0}
            type={ToastTypes.message}
            text='Loading more rows...'
          />
        </div>
      </CSSTransition>
      <SpinnerWithIcon loading={isLoadingFirstPage}/>
    </div>
  )
}

export default Body
