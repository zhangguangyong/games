import React, {FC, ReactElement, useEffect, useState} from 'react'
import {ICell} from 'pages/Game/1024/types'

/**
 * 背景色与数字对应关系
 */
const BACKGROUND_COLOR_MAP = new Map<number, string>([
  [2, '#f8c67e'],
  [4, '#efb964'],
  [8, '#ee8b22'],
  [16, '#f26a21'],
  [32, '#ea5e51'],
  [64, '#ed1c24'],
  [128, '#edcc61'],
  [256, '#edcf72'],
  [512, '#edc850'],
  [1024, '#edc53f'],
  [2048, '#fac603']
])
/**
 * 默认背景色
 */
const DEFAULT_BACKGROUND_COLOR = '#eee4da59'

export const Cell: FC<ICell> = (props): ReactElement => {
  const {height, width, num} = props
  // 背景色状态
  const [backgroundColor, setBackgroundColor] = useState<string>(DEFAULT_BACKGROUND_COLOR)
  // 字体大小状态
  const [fontSize, setFontSize] = useState<number>(45)

  /**
   * 监听数字的变化
   */
  useEffect(() => {
    setBackgroundColor(!num ? DEFAULT_BACKGROUND_COLOR : BACKGROUND_COLOR_MAP.has(num) ? BACKGROUND_COLOR_MAP.get(num)! : '#fac603')
    if (num && num > 100) {
      setFontSize(45 - ((num + '').length - 2) * 5)
    }
  }, [num])

  return (
    <div className="cell" style={{height, width, backgroundColor}}>
      <div className="inner" style={{fontSize}}>
        {num}
      </div>
    </div>
  )
}
