import React, {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {ActionType, DefaultSetting, Direction, IGame, Status} from 'pages/Game/1024/types'
import {gameReducer, reset} from 'pages/Game/1024/reducers'
import {mapToObject, objectToMap} from 'utils'
import {isDown, isLeft, isRight, isUp} from 'utils/keyboard'
import {Grid} from 'pages/Game/1024/Grid'
import './index.scss'
import {GameContext} from 'pages/Game/1024/contexts'
import {Control} from 'pages/Game/1024/Control'

const gameCacheKey = 'game-1024'
const settingCacheKey = 'game-1024-setting'
export const Game1024: FC = (): ReactElement => {
  let settingCache = localStorage.getItem(settingCacheKey)
  let [setting, setSetting] = useState(settingCache ? JSON.parse(settingCache) : DefaultSetting)
  useEffect(() => {
    localStorage.setItem(settingCacheKey, JSON.stringify(setting))
  }, [setting])

  // 游戏
  const init = (): IGame => {
    let cache = localStorage.getItem(gameCacheKey)
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

  let [state, dispatch] = useReducer(gameReducer, [], init)

  useEffect(() => {
    if (state.next) {
      dispatch({type: ActionType.DRAW})
    }
  }, [state.next])

  useEffect(() => {
    if (state.map) {
      if (state.status === Status.END) {
        localStorage.removeItem(gameCacheKey)
      } else {
        let copy = {...state, map: mapToObject(state.map), previousMap: mapToObject(state.previousMap)}
        localStorage.setItem(gameCacheKey, JSON.stringify(copy))
      }
    }
  }, [state])

  // 按键
  const handleKeyDown = (e: any) => {
    if (isUp(e)) {
      dispatch({type: ActionType.MOVE, payload: Direction.UP})
      return
    }
    if (isDown(e)) {
      dispatch({type: ActionType.MOVE, payload: Direction.DOWN})
      return
    }
    if (isLeft(e)) {
      dispatch({type: ActionType.MOVE, payload: Direction.LEFT})
      return
    }
    if (isRight(e)) {
      dispatch({type: ActionType.MOVE, payload: Direction.RIGHT})
      return
    }
  }

  return (
    <GameContext.Provider value={{state, dispatch, setting, setSetting}}>
      <div className="game-1024" tabIndex={0} onKeyDown={handleKeyDown}>
        <Control/>
        <Grid {...setting}/>
      </div>
    </GameContext.Provider>
  )
}
