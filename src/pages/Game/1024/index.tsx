import React, {FC, ReactElement, useEffect, useReducer, useState} from 'react'
import {ActionType, Direction, IGame, IGrid, Status} from 'pages/Game/1024/types'
import {gameReducer, reset} from 'pages/Game/1024/reducers'
import {mapToObject, objectToMap} from 'utils'
import {isDown, isLeft, isRight, isUp} from 'utils/keyboard'
import {Grid} from 'pages/Game/1024/Grid'
import './index.scss'
import {GameContext} from 'pages/Game/1024/contexts'

const cacheKey = 'game-1024'
export const G1024: FC = (): ReactElement => {
  let [grid, setGrid] = useState<IGrid>({
    rows: 4,
    cols: 4,
    width: 107,
    height: 107
  })

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
    return reset(grid)

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
        localStorage.removeItem(cacheKey)
      } else {
        let copy = {...state, map: mapToObject(state.map), previousMap: mapToObject(state.previousMap)}
        localStorage.setItem(cacheKey, JSON.stringify(copy))
      }
    }
  }, [state])

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

  const handleRestart = () => {
    dispatch({type: ActionType.RESET, payload: reset(grid)})
  }


  return (
    <GameContext.Provider value={{state, dispatch}}>
      <div className="game-1024" tabIndex={0} onKeyDown={handleKeyDown}>
        <div className="control">
          <button onClick={() => handleRestart()}>重新开始</button>
        </div>

        <Grid {...grid}/>

        <div className="info">
          {state.status === Status.END ? <span style={{color: 'red'}}>游戏结束</span> :
            <span style={{color: 'green'}}>游戏正常</span>}
        </div>
      </div>
    </GameContext.Provider>
  )
}
