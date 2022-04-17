import React, {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {ActionType, Direction, IGame, Status} from 'pages/1024/types'
import {mapToObject, objectToMap, toPositionKey} from 'utils'
import {gameReducer, reset} from 'pages/1024/reducers'
import {Grid} from 'components/Game/Grid'
import {ICell} from 'components/Game/types'
import './index.scss'
import {Button, Space} from 'antd'
import {FullscreenExitOutlined, FullscreenOutlined, MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons'

const cacheKey = '1024'
const settingCacheKey = '1024-setting'

export const G1024: FC = (): ReactElement => {
  /**
   * 初始化设置
   */
  let settingCache = localStorage.getItem(settingCacheKey)
  let [setting, setSetting] = useState(settingCache ? JSON.parse(settingCache) : {
    rows: 4,
    cols: 4,
    width: 107,
    height: 107
  })
  useEffect(() => {
    localStorage.setItem(settingCacheKey, JSON.stringify(setting))
  }, [setting])

  /**
   * 初始化状态
   */
  const init = (): IGame => {
    let cache = localStorage.getItem(cacheKey)
    if (cache) {
      let obj = JSON.parse(cache)
      return {
        ...obj,
        map: objectToMap(obj.map),
        previousMap: objectToMap(obj.previousMap)
      }
    }
    return reset(setting)
  }
  const [state, dispatch] = useReducer(gameReducer, [], init)

  /**
   * 监听下一个数字
   */
  useEffect(() => {
    if (state.next) {
      dispatch({type: ActionType.DRAW})
    }
  }, [state.next])

  /**
   * 缓存状态
   */
  useEffect(() => {
    if (state.map) {
      if (state.status === Status.END) {
        localStorage.removeItem(cacheKey)
      } else {
        let copy = {...state, map: mapToObject(state.map), previousMap: mapToObject(state.previousMap)}
        localStorage.setItem(cacheKey, JSON.stringify(copy))
      }
    }
  }, [state])

  /**
   * 按键处理
   * @param e
   */
  const handleKeyDown = (e: any) => {
    let key = e.key.toString()
    if (['ArrowUp', 'w', 'i'].includes(key)) {
      dispatch({type: ActionType.MOVE, payload: Direction.UP})
      return
    }
    if (['ArrowDown', 's', 'k'].includes(key)) {
      dispatch({type: ActionType.MOVE, payload: Direction.DOWN})
      return
    }
    if (['ArrowLeft', 'a', 'j'].includes(key)) {
      dispatch({type: ActionType.MOVE, payload: Direction.LEFT})
      return
    }
    if (['ArrowRight', 'd', 'l'].includes(key)) {
      dispatch({type: ActionType.MOVE, payload: Direction.RIGHT})
      return
    }
  }

  /**
   * 重新开始
   */
  const handleRestart = () => {
    dispatch({type: ActionType.RESET, payload: reset(setting)})
  }

  /**
   * 设置
   * @param type
   */
  const handleSetting = (type: string): void => {
    if (['+', '-'].includes(type)) {
      let v = type === '+' ? 1 : -1
      const newSetting = {...setting, rows: setting.rows + v, cols: setting.cols + v}
      setSetting(newSetting)
      dispatch({type: ActionType.RESET, payload: reset(newSetting)})
    }
    if (['放', '缩'].includes(type)) {
      let v = type === '放' ? 5 : -5
      setSetting({...setting, rows: setting.height + v, cols: setting.width + v})
    }
  }

  const colorMap = new Map<number, string>([
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
  const renderCell = ({position}: ICell) => {
    let value = state.map.get(toPositionKey(position))
    let fontSize = 45
    if (value && value > 100) {
      fontSize = 45 - ((value + '').length - 2) * 5
    }
    return (
      <div className="inner" style={{fontSize: fontSize + 'px'}}>{value}</div>
    )
  }
  const getCellStyle = ({position}: ICell): React.CSSProperties => {
    let value = state.map.get(toPositionKey(position))
    return {
      backgroundColor: (!value ? 'rgba(238, 228, 218, 0.35)' : colorMap.has(value) ? colorMap.get(value)! : '#fac603')
    }
  }

  const render = () => {
    const {rows, cols, width, height} = setting
    const size = 'small'
    return (
      <div className="game-1024" tabIndex={0} onKeyDown={handleKeyDown}>
        <div className="control">
          <Space>
            <Button type="primary" size={size} onClick={() => handleRestart()}>重新开始</Button>
            <Button type="primary" size={size} onClick={() => handleSetting('+')} icon={<PlusCircleOutlined/>}/>
            <Button type="primary" size={size} onClick={() => handleSetting('-')} icon={<MinusCircleOutlined/>}/>
            <Button type="primary" size={size} onClick={() => handleSetting('放')} icon={<FullscreenOutlined/>}/>
            <Button type="primary" size={size} onClick={() => handleSetting('缩')} icon={<FullscreenExitOutlined/>}/>
          </Space>
        </div>

        <Grid
          {...setting}
          style={{
            height: (rows * height + rows * 10 + 10) + 'px',
            width: (cols * width + cols * 10 + 10) + 'px',
          }}
          cellStyle={getCellStyle}
        >
          {(cell: ICell) => renderCell(cell)}
        </Grid>
      </div>
    )
  }

  return render()
}
