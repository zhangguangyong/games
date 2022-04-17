import {FC, ReactElement} from 'react'
import './index.scss'

interface IProps {
  name: string
  width: number
  height: number
}

export const IconFont: FC<IProps> = (
  {name, width, height}
): ReactElement => {
  return (
    <svg className="icon-font-component" aria-hidden="true" style={{width: width + 'px', height: height + 'px'}}>
      <use xlinkHref={'#icon-' + name}/>
    </svg>
  )
}
