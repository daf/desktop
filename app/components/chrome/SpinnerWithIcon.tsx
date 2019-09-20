import * as React from 'react'
import Spinner from './Spinner'
import { logo } from '../WelcomeTemplate'

interface SpinnerWithIconProps {
  title?: string
  subtitle?: string
  loading: boolean
  spinner?: boolean
}

const SpinnerWithIcon: React.FunctionComponent<SpinnerWithIconProps> = ({ loading, title, subtitle, spinner = true, children }) => {
  if (!loading) return null
  return (
    <div className='welcome-center' id='spinner-with-icon-wrap'>
      <img className='welcome-graphic' id='spinner-with-icon-graphic' src={logo} />
      <div className='welcome-title'>
        <h2>{title}</h2>
        <h6>{subtitle}</h6>
      </div>
      <div className='welcome-content'>
        {children}
        <div className='welcome-spinner'>
          {spinner && <Spinner/>}
        </div>
      </div>
    </div>
  )
}

export default SpinnerWithIcon
