import { connect } from 'react-redux'
import Body from '../components/Body'
import Store, { WorkingDataset } from '../models/store'
import { fetchBody, fetchCommitBody } from '../actions/api'
import { ApiAction } from '../store/api'

import { Dispatch } from 'redux'

const extractColumnHeaders = (workingDataset: WorkingDataset): undefined | object => {
  const schema = workingDataset.components.schema.value

  if (!schema) {
    return undefined
  }

  if (schema && (!schema.items || (schema.items && !schema.items.items))) {
    return undefined
  }

  return schema && schema.items && schema.items.items.map((d: { title: string }): string => d.title)
}

interface BodyContainerProps {
  history?: boolean
}

const mapStateToProps = (state: Store, ownProps: BodyContainerProps) => {
  const { history } = ownProps
  const { workingDataset, commitDetails } = state
  const dataset = history ? commitDetails : workingDataset
  const { isLoading, value } = dataset.components.body

  const headers = extractColumnHeaders(workingDataset)

  // get data for the currently selected component
  return {
    isLoading,
    headers,
    value
  }
}

// const actions = {
//   onFetch: fetchBody
// }

interface Actions {
  onFetch: () => Promise<ApiAction>
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: BodyContainerProps): Actions => {
  const onFetch = ownProps.history ? fetchCommitBody : fetchBody
  return { onFetch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)
