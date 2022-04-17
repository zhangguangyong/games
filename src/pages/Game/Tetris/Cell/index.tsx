import React, {FC, ReactElement} from 'react'
import {ICell} from '../types'
import {IconFont} from 'components/IconFont'

/**
 * 单元格
 * @param props
 * @constructor
 */
export const Cell: FC<ICell> = (props): ReactElement => {
  const {height, width, fill} = props

  return (
    <div className="cell" style={{width, height}}>
      {fill && <IconFont name="xiaofangkuai" width={width!} height={height!}/>}
    </div>
  )
}
