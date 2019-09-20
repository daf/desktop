import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'
import ParseError from './ParseError'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

import { getComponentDisplayProps, StatusDot } from './ComponentList'

import { ComponentStatus, SelectedComponent } from '../models/store'

interface DatasetComponentProps {
  isLoading: boolean
  component: SelectedComponent
  componentStatus: ComponentStatus
  history?: boolean
  fsiPath?: string
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component: selectedComponent, componentStatus, isLoading, history = false, fsiPath } = props

  const hasParseError = componentStatus && componentStatus.status === 'parse error'
  const component = selectedComponent || 'meta'
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)

  return (
    <div className='component-container'>
      <div className='component-header'>
        <div className='component-display-name-container'>
          <div className='component-display-name' data-tip={tooltip}>
            <FontAwesomeIcon icon={icon} size='sm'/> {displayName}
          </div>
        </div>
        <div className='status-dot-container'>
          {componentStatus && <StatusDot status={componentStatus.status} />}
        </div>
      </div>
      <div className='component-content transition-group'>
        {
          !!componentStatus && hasParseError &&
          <div id='transition-wrap'>
            <ParseError fsiPath={fsiPath || ''} filename={componentStatus && componentStatus.filepath} component={component} />
          </div>
        }
        {
          (component === 'meta') && !isLoading && !hasParseError &&
          <div id='transition-wrap'>
            <MetadataContainer history={history}/>
          </div>
        }
        {
          component === 'body' && !hasParseError &&
          <div id='transition-wrap'>
            <BodyContainer history={history}/>
          </div>
        }
        {
          component === 'schema' && !isLoading && !hasParseError &&
          <div id='transition-wrap'>
            <SchemaContainer history={history}/>
          </div>
        }
        {
          isLoading && <SpinnerWithIcon loading={true}/>
        }
      </div>
    </div>
  )
}
export default DatasetComponent
