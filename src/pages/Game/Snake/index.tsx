import {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {ActionType, DefaultSetting, Direction, ISetting, KeyDirectionMap, Status} from './types'
import {gameReducer, reset} from './reducers'
import {Grid} from './Grid'
import './index.scss'
import {GameContext} from './contexts'
import {Control} from './Control'

const SPEED_MIN = 300
const SPEED_MAX = 50
const settingCacheKey = 'game-snake-setting'
/**
 * 面板
 * @constructor
 */
export const GameSnake: FC = (): ReactElement => {
  let settingCache = localStorage.getItem(settingCacheKey)
  let [setting, setSetting] = useState<ISetting>(settingCache ? JSON.parse(settingCache) : DefaultSetting)
  useEffect(() => {
    localStorage.setItem(settingCacheKey, JSON.stringify(setting))
  }, [setting])

  let [state, dispatch] = useReducer(gameReducer, reset(setting))
  let [timer, setTimer] = useState<any>()

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
    // 暂停/启动
    if (e.code === 'Space' || e.code === 'Enter') {
      handleAction()
      return
    }
    if (state.status !== Status.START) {
      return
    }

    let key = e.key.toString()
    if (!KeyDirectionMap.has(key)) {
      return
    }

    let oldDirection = state.direction
    let newDirection = KeyDirectionMap.get(key)!
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
    const {status} = state
    // 开始/结束 => 启动
    if (status === Status.PREPARE || status === Status.END) {
      if (status === Status.END) {
        dispatch({type: ActionType.RESET, payload: setting})
      }
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.START})
      return
    }
    // 启动 => 暂停
    if (status === Status.START) {
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.STOP})
      return
    }
    // 暂停 => 启动
    if (status === Status.STOP) {
      dispatch({type: ActionType.CHANGE_STATUS, payload: Status.START})
    }
  }

  return (
    <GameContext.Provider value={{state, dispatch, setting, setSetting, handleAction}}>
      <div className="game-snake" tabIndex={0} onKeyDown={handleTurn}>
        <Control/>
        <Grid/>
      </div>
    </GameContext.Provider>
  )
}
