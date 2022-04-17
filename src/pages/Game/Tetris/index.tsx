import {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import './index.scss'
import {ActionType, DefaultSetting, Direction, ISetting, Status} from './types'
import {gameReducer, reset} from './reducers'
import {Grid} from './Grid'
import {GameContext} from './contexts'
import {Control} from 'pages/Game/Tetris/Control'

/**
 * 面板
 * @constructor
 */
export const GameTetris: FC = (): ReactElement => {
  let [setting, setSetting] = useState<ISetting>(DefaultSetting)
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

  /**
   * 开始/暂停/启动
   */
  const handleAction = () => {
    const {status} = state
    // 开始/结束 => 启动
    if (status === Status.PREPARE || status === Status.END) {
      if (status === Status.END) {
        dispatch({type: ActionType.RESET, payload: setting})
      }
      dispatch({type: ActionType.STATUS, payload: Status.START})
    }
    // 启动 => 暂停
    if (status === Status.START) {
      dispatch({type: ActionType.STATUS, payload: Status.STOP})
      return
    }
    // 暂停 => 启动
    if (status === Status.STOP) {
      dispatch({type: ActionType.STATUS, payload: Status.START})
    }
  }

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
      handleAction()
      return
    }

    // 空格键，一键下落
    if (e.code === 'Space') {
      dispatch({type: ActionType.ONE_KEY})
      return
    }
  }

  return (
    <GameContext.Provider value={{state, dispatch, setting, setSetting, handleAction}}>
      <div className="game-tetris" tabIndex={0} onKeyDown={handleKeyDown}>
        <Grid/>
        <Control/>
      </div>
    </GameContext.Provider>
  )
}
