import React, {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {Grid} from 'components/Game/Grid'
import {ActionType, Direction, ISetting, Status} from 'pages/Tetris/types'
import {gameReducer, reset} from 'pages/Tetris/reducers'
import './index.scss'
import {ICell} from 'components/Game/types'
import {IconFont} from 'components/IconFont'
import {Const, toPositionKey} from 'utils'
import {Button} from 'antd'

export const Tetris: FC = (): ReactElement => {

  let [setting, setSetting] = useState<ISetting>({
    rows: 20,
    cols: 10,
    width: 25,
    height: 25,
    speed: 1
  })

  let [state, dispatch] = useReducer(gameReducer, reset(setting))
  let [timer, setTimer] = useState<any>()


  const SPEED_MAX = 500
  const SPEED_MIN = 50
  /**
   * 图形自动下落
   * @param ms
   */
  const run = (ms: number) => {
    setTimer(
      setTimeout(() => {
        dispatch({type: ActionType.MOVE, payload: Direction.DOWN})
        run(ms)
      }, ms)
    )
  }
  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }
    let ms = Math.max(SPEED_MAX - setting.speed * (state.level * 30), SPEED_MIN)
    run(ms)
  }, [setting.speed, state.level])

  /**
   * 当图形下落完成，画出下一个图形
   */
  useEffect(() => {
    if (state.locked || state.status === Status.END) {
      return
    }
    dispatch({type: ActionType.DRAW})
  }, [state.locked, state.status])

  /**
   * 当得分时消除行
   */
  useEffect(() => {
    if (state.scoreRows.length) {
      dispatch({type: ActionType.SCORE})
    }
  }, [state.scoreRows.length])

  const handleKeyDown = (e: any) => {
    let key = e.key.toString()
    if (['ArrowUp', 'w', 'i'].includes(key)) {
      dispatch({type: ActionType.CHANGE})
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

    // 确认键控制
    if (e.code === 'Enter') {
      handleControl()
      return
    }

    // 空格键，一键下落
    if (e.code === 'Space') {
      dispatch({type: ActionType.ONE_KEY})
      return
    }
  }

  /**
   * 开始/暂停/启动
   */
  const handleControl = () => {
    // 开始/结束 => 启动
    if (state.status === Status.PREPARE || state.status === Status.END) {
      if (state.status === Status.END) {
        dispatch({type: ActionType.RESET, payload: setting})
      }
      dispatch({type: ActionType.STATUS, payload: Status.START})
    }
    // 启动 => 暂停
    if (state.status === Status.START) {
      dispatch({type: ActionType.STATUS, payload: Status.STOP})
      return
    }
    // 暂停 => 启动
    if (state.status === Status.STOP) {
      dispatch({type: ActionType.STATUS, payload: Status.START})
    }
  }

  const renderNext = () => {
    let keys = state.next.points!.map(item => toPositionKey(item))
    const {width, height} = setting
    // todo 需要调整
    const offset = 3
    return (
      <Grid rows={2} cols={4} width={width!} height={height!}>
        {({position, width, height}: ICell) =>
          (keys.includes(toPositionKey({y: position.y, x: position.x + offset})) &&
            <IconFont name="xiaofangkuai" width={width!} height={height!}/>)
        }
      </Grid>
    )
  }

  const renderCell = (cell: ICell) => {
    const {position, width, height} = cell
    let key = toPositionKey(position)
    if (state.map.has(key) && state.map.get(key) !== Const.EMPTY) {
      return (
        <IconFont name="xiaofangkuai" width={width!} height={height!}/>
      )
    }
  }

  const render = () => {
    const size = 'small'
    const {status} = state
    return (
      <div className="game-tetris" tabIndex={0} onKeyDown={handleKeyDown}>
        <Grid
          {...setting}
        >
          {(cell: ICell) => renderCell(cell)}
        </Grid>

        <div className="info" style={{height: setting.rows * setting.height + 'px'}}>
          <div>
            <Button type="primary" danger={status === Status.END} size={size} onClick={handleControl}>
              {status === Status.PREPARE ? '开始游戏' : status === Status.END ? '重新开始' : status === Status.START ? '暂停' : '启动'}
            </Button>
          </div>
          <div>
            <div>分数</div>
            <div className="num">{state.score}</div>
          </div>
          <div>
            <div>等级</div>
            <div className="num">{state.level}</div>
          </div>
          <div>
            <div>行数</div>
            <div className="num">{state.rows}</div>
          </div>
          <div>
            下一个
          </div>
          <div className="next">
            {renderNext()}
          </div>

          {/*<div>*/}
          {/*  <div>行数</div>*/}
          {/*  <InputNumber*/}
          {/*    size={size}*/}
          {/*    min={10}*/}
          {/*    defaultValue={setting.rows}*/}
          {/*    onChange={(value: number) => {*/}
          {/*      setSetting({...setting, rows: value})*/}
          {/*    }}/>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <div>列数</div>*/}
          {/*  <InputNumber*/}
          {/*    size={size}*/}
          {/*    min={10}*/}
          {/*    defaultValue={setting.cols}*/}
          {/*    onChange={(value: number) => {*/}
          {/*      setSetting({...setting, cols: value})*/}
          {/*    }}/>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <div>大小</div>*/}
          {/*  <InputNumber*/}
          {/*    size={size}*/}
          {/*    min={10}*/}
          {/*    defaultValue={setting.height}*/}
          {/*    onChange={(value: number) => {*/}
          {/*      setSetting({...setting, width: value, height: value})*/}
          {/*    }}/>*/}
          {/*</div>*/}

        </div>
      </div>
    )
  }

  return render()
}
