import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import ReactJson from 'react-json-view'

import Toast, { ToastTypes } from './chrome/Toast'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import HandsonTable from './HandsonTable'
import { ApiAction } from '../store/api'

import { PageInfo, WorkingDataset } from '../models/store'

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

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    value,
    pageInfo,
    workingDataset,
    history,
    fetchBody,
    format,
    fetchCommitBody
  } = props
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
            : <ReactJson
              name={null}
              src={value}
              displayDataTypes={false}
            />
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
