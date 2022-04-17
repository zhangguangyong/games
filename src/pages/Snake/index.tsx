import React, {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {ActionType, Direction, ISetting, SquareType, Status} from './types'
import {gameReducer, reset} from './reducers'
import './index.scss'
import {Grid} from 'components/Game/Grid'
import {ICell} from 'components/Game/types'
import {IconFont} from 'components/IconFont'
import {toPositionKey} from 'utils'
import _ from 'lodash'

/**
 * 面板
 * @constructor
 */
const Snake: FC = (): ReactElement => {
  let initSetting = JSON.parse(localStorage.getItem('setting') || '{}')
  let [setting, setSetting] = useState<ISetting>({
    rows: 20,
    cols: 20,
    width: 30,
    height: 30,
    speed: 1,
    ...initSetting
  })

  let [state, dispatch] = useReducer(gameReducer, reset(setting))
  let [timer, setTimer] = useState<any>()

  const SPEED_MIN = 300
  const SPEED_MAX = 50

  /**
   * 保存设置
   */
  useEffect(() => {
    localStorage.setItem('setting', JSON.stringify(setting))
  }, [setting])

  /**
   * 运行
   * @param speed
   */
  const run = (speed: number) => {
    setTimer(
      setTimeout(() => {
        dispatch({type: ActionType.RUN})
        run(speed)
      }, speed)
    )
  }

  /**
   * 调整速度
   */
  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }
    let speed: number = Math.max(SPEED_MIN - (setting.speed - 1) * 30, SPEED_MAX)
    run(speed)
  }, [setting.speed])

  /**
   * 转向
   * @param e
   */
  const handleTurn = (e: any): void => {
    let directionMap = new Map<string, Direction>([
      ['ArrowUp', Direction.UP],
      ['ArrowDown', Direction.DOWN],
      ['ArrowLeft', Direction.LEFT],
      ['ArrowRight', Direction.RIGHT],

      ['w', Direction.UP],
      ['s', Direction.DOWN],
      ['a', Direction.LEFT],
      ['d', Direction.RIGHT],

      ['i', Direction.UP],
      ['k', Direction.DOWN],
      ['j', Direction.LEFT],
      ['l', Direction.RIGHT]
    ])

    // 暂停/启动
    if (e.code === 'Space' || e.code === 'Enter') {
      handleAction()
      return
    }
    if (state.status !== Status.START) {
      return
    }

    let key = e.key.toString()
    if (!directionMap.has(key)) {
      return
    }

    let oldDirection = state.direction
    let newDirection = directionMap.get(key)!
    // 重复和反方向无效
    if (
      oldDirection === newDirection ||
      (oldDirection === Direction.UP && newDirection === Direction.DOWN) ||
      (oldDirection === Direction.DOWN && newDirection === Direction.UP) ||
      (oldDirection === Direction.LEFT && newDirection === Direction.RIGHT) ||
      (oldDirection === Direction.RIGHT && newDirection === Direction.LEFT)
    ) {
      return
    }
    // 转弯
    dispatch({type: ActionType.TURN, payload: newDirection})
  }

  /**
   * 开始/暂停/启动
   */
  const handleAction = () => {
    // 开始/结束 => 启动
    if (state.status === Status.PREPARE || state.status === Status.END) {
      if (state.status === Status.END) {
        dispatch({type: ActionType.RESET, payload: setting})
      }
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.START})
      return
    }
    // 启动 => 暂停
    if (state.status === Status.START) {
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.STOP})
      return
    }
    // 暂停 => 启动
    if (state.status === Status.STOP) {
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.START})
    }
  }

  /**
   * 设置
   * @param type
   * @param item
   */
  const handleSetting = (type: string, item: string): void => {
    let v: number = type === '+' ? 1 : -1
    switch (item) {
      case '速':
        setSetting({...setting, speed: setting.speed + v})
        return
      case '行':
        setSetting({...setting, rows: setting.rows + v})
        break
      case '列':
        setSetting({...setting, cols: setting.cols + v})
        break
      case '宽':
        setSetting({...setting, width: setting.width + v})
        break
      case '高':
        setSetting({...setting, height: setting.height + v})
        break
    }
    dispatch({type: ActionType.RESET, payload: setting})
    return
  }

  /**
   * 渲染设置
   */
  const renderSetting = () => {
    let enabled: boolean = state.status === Status.PREPARE || state.status === Status.END
    let isStart = state.status === Status.START
    console.log(isStart)
    return (
      ['速', '行', '列', '宽', '高'].map((item) => (
        <div key={item}>
          <span>{item}</span>
          <button disabled={item === '速' ? isStart : !enabled} onClick={() => handleSetting('+', item)}>+</button>
          <span>
            {item === '速' ? setting.speed : item === '行' ? setting.rows : item === '列' ? setting.cols : item === '宽' ? setting.width : item === '高' ? setting.height : ''}
          </span>
          <button disabled={item === '速' ? isStart : !enabled} onClick={() => handleSetting('-', item)}>-</button>
        </div>
      ))
    )
  }

  const iconMap = new Map<SquareType, string[]>([
    [SquareType.DEFAULT, ['']],
    [SquareType.HEADER, ['sheshe']],
    [SquareType.BODY, ['youleyuan']],
    [SquareType.FOOD, ['lanqiu', 'taiqiu', 'duoseqiu', 'wangqiu', 'lanqiu1', 'lanqiu2', 'piqiu', 'diqiu', 'a-diqiuxingqiu', 'a-qiuhaiyangqiuyouxi']]
  ])
  const renderCell = (cell: ICell) => {
    const {position, width, height} = cell
    const key = toPositionKey(position)
    let type = state.map.get(key)!
    let icon = _.sample(iconMap.get(type))!
    console.log(icon)
    return (
      <IconFont name={icon} width={width as number} height={height as number}/>
    )
  }

  return (
    <div className="game-snake" tabIndex={0} onKeyDown={handleTurn}>
      <div className="control" style={{width: setting.cols * setting.width + 'px'}}>
        <div>
          <button
            onClick={handleAction}>
            {
              (state.status === Status.PREPARE || state.status === Status.END) ? '开始' : state.status === Status.START ? '暂停' : '启动'
            }
          </button>
        </div>
        <div>分数：<span style={{color: 'red'}}>{state.body.length}</span></div>
        {
          renderSetting()
        }
      </div>

      <Grid
        {...setting}
      >
        {(cell: ICell) => renderCell(cell)}
      </Grid>

      <div className="info">
        {(state.status === Status.END ?
            <span style={{color: 'red'}}>游戏结束</span> :
            <span style={{color: 'green'}}>游戏正常</span>
        )}
      </div>
    </div>
  )
}

export default Snake
