import {FC, ReactElement} from 'react'
import {ICell} from 'components/Game/types'

export const Cell: FC<ICell> = (props): ReactElement => {
  const {width, height, children, style} = props
  return (
    <div className="cell" style={{width: width + 'px', height: height + 'px', ...style}}>
      {children}
    </div>
  )
}
