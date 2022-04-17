import React, {FC, ReactElement, useEffect, useState} from 'react'
import {CellTypeIconMap, ICell} from '../types'
import {IconFont} from 'components/IconFont'
import _ from 'lodash'

export const Cell: FC<ICell> = (props): ReactElement => {
  const {width, height, type} = props
  let [icon, setIcon] = useState<string>('')
  useEffect(() => {
    setIcon(_.sample(CellTypeIconMap.get(type!))!)
  }, [type])
  return (
    <div style={{width, height}}>
      {
        <IconFont name={icon} width={width!} height={height!}/>
      }
    </div>
  )
}
