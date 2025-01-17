import * as React from 'react'
import { HeaderColumnButtonProps } from './HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface HeaderColumnButtonDropdownProps extends HeaderColumnButtonProps {
  items: React.ReactElement[]
}

const HeaderColumnButtonDropdown: React.FunctionComponent<HeaderColumnButtonDropdownProps> = (props) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const toggleMenu = (event: React.MouseEvent) => {
    setShowMenu(!showMenu)
    event.stopPropagation()
  }
  const dropdown: any = React.useRef(null)

  const handleClick = (e: MouseEvent) => {
    // check whether an app-wide click is in this component
    if (dropdown.current !== null && dropdown.current.contains(e.target)) {
      // if it's in this component, but is a dropdown item, close the dropdown
      const element = e.target as HTMLElement
      if (element.tagName === 'LI') setShowMenu(false)

      // inside click
      return
    }
    // close the dropdown if the click happened outside of this component
    setShowMenu(false)
  }

  React.useEffect(() => {
    document.addEventListener('click', (e) => handleClick(e))

    return () => {
      document.removeEventListener('click', (e) => handleClick(e))
    }
  })

  const { id = '', icon, label = '', tooltip, onClick = toggleMenu, items } = props

  return (
    <div
      id={id}
      ref={dropdown}
      className='header-column header-column-dropdown'
      data-tip={tooltip}
      onClick={onClick}
    >
      {React.isValidElement(icon)
        ? icon
        : <div className='header-column-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
      }
      {(label !== '') &&
        <div className='header-column-text'>
          <div className='label'>{label}</div>
        </div>
      }
      <div className='header-column-arrow' onClick={toggleMenu}>
        {showMenu
          ? <div className="arrow collapse">&nbsp;</div>
          : <div className="arrow expand">&nbsp;</div>
        }
      </div>
      {showMenu && (
        <ul className='dropdown'>
          {items.map((elem) => (elem))}
        </ul>)
      }
    </div>
  )
}

export default HeaderColumnButtonDropdown
