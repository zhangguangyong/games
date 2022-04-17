import {ActionType, Direction, IAction, ICell, IGame, ISetting, Status} from 'pages/Game/1024/types'
import {Const, fromPositionKey, getMapKeys, toPositionKey} from 'utils'
import _ from 'lodash'

export const gameReducer = (state: IGame, action: IAction) => {
  const {type, payload} = action
  const {map, status} = state

  if (type === ActionType.RESET) {
    return payload
  }

  if (status === Status.END) {
    return state
  }

  if (type === ActionType.DRAW) {
    if (!isMoved(state)) {
      return {...state, next: false}
    }
    draw(state)
    if (isEnd(state)) {
      return {...state, status: Status.END}
    }
    return {...state, map, previousMap: new Map<string, any>(map), next: false}
  }

  if (type === ActionType.MOVE) {
    let direction = action.payload as Direction
    move(direction, state)
    return {...state, next: true}
  }

  return state
}

/**
 * 移动
 * @param direction
 * @param game
 */
const move = (direction: Direction, game: IGame) => {
  const {minX, maxX, minY, maxY} = game
  let map = game.map

  if (direction === Direction.UP) {
    for (let y = minY + 1; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        let oldKey = toPositionKey({y: y, x: x})
        if (map.get(oldKey) === Const.EMPTY) {
          continue
        }
        let offset = 0
        for (let k = y - 1; k >= minY; k--) {
          if (map.get(toPositionKey({y: k, x: x})) !== Const.EMPTY) {
            break
          }
          offset++
        }
        let newKey = toPositionKey({y: y - offset, x})
        exchange(oldKey, newKey, direction, game)
      }
    }
  }

  if (direction === Direction.DOWN) {
    for (let y = maxY - 1; y >= minY; y--) {
      for (let x = minX; x <= maxX; x++) {
        let oldKey = toPositionKey({y: y, x: x})
        if (map.get(oldKey) === Const.EMPTY) {
          continue
        }
        let offset = 0
        for (let k = y + 1; k <= maxY; k++) {
          if (map.get(toPositionKey({y: k, x: x})) !== Const.EMPTY) {
            break
          }
          offset++
        }
        let newKey = toPositionKey({y: y + offset, x})
        exchange(oldKey, newKey, direction, game)
      }
    }
  }

  if (direction === Direction.LEFT) {
    for (let x = minX + 1; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let oldKey = toPositionKey({y: y, x: x})
        if (map.get(oldKey) === Const.EMPTY) {
          continue
        }
        let offset = 0
        for (let k = x - 1; k >= minX; k--) {
          if (map.get(toPositionKey({y: y, x: k})) !== Const.EMPTY) {
            break
          }
          offset++
        }
        let newKey = toPositionKey({y: y, x: x - offset})
        exchange(oldKey, newKey, direction, game)
      }
    }
  }

  if (direction === Direction.RIGHT) {
    for (let x = maxX - 1; x >= minX; x--) {
      for (let y = minY; y <= maxY; y++) {
        let oldKey = toPositionKey({y: y, x: x})
        if (map.get(oldKey) === Const.EMPTY) {
          continue
        }

        let offset = 0
        for (let k = x + 1; k <= maxX; k++) {
          if (map.get(toPositionKey({y: y, x: k})) !== Const.EMPTY) {
            break
          }
          offset++
        }
        let newKey = toPositionKey({y: y, x: x + offset})
        exchange(oldKey, newKey, direction, game)
      }
    }
  }

  merge(direction, game)
}

/**
 * 交换位置
 * @param oldKey
 * @param newKey
 * @param direction
 * @param game
 */
const exchange = (oldKey: string, newKey: string, direction: Direction, game: IGame) => {
  const {map} = game
  if (oldKey === newKey) {
    return
  }
  map.set(newKey, map.get(oldKey))
  map.set(oldKey, Const.EMPTY)
}
/**
 * 合并
 * @param direction
 * @param game
 */
const merge = (direction: Direction, game: IGame) => {
  const {map, minY, maxY, minX, maxX} = game

  if (direction === Direction.UP) {
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        let key = toPositionKey({y: y, x: x})
        let mergeKey = toPositionKey({y: y + 1, x})
        let value = map.get(key)
        let mergeValue = map.get(mergeKey)
        if (value !== Const.EMPTY && value === mergeValue) {
          map.set(key, value * 2)
          map.set(mergeKey, Const.EMPTY)
          // 下边的往上移动一格
          _.range(y + 1, maxY + 1).forEach(item => {
            let itemKey = toPositionKey({y: item, x})
            if (map.get(itemKey) !== Const.EMPTY) {
              map.set(toPositionKey({y: item - 1, x}), map.get(itemKey))
              map.set(itemKey, Const.EMPTY)
            }
          })
        }
      }
    }
  }

  if (direction === Direction.DOWN) {
    for (let x = minX; x <= maxX; x++) {
      for (let y = maxY; y > minY; y--) {
        let key = toPositionKey({y: y, x: x})
        let mergeKey = toPositionKey({y: y - 1, x})
        let value = map.get(key)
        let mergeValue = map.get(mergeKey)
        if (value !== Const.EMPTY && value === mergeValue) {
          map.set(key, value * 2)
          map.set(mergeKey, Const.EMPTY)
          // 上边的往下移动一格
          _.range(y - 1, minY - 1).forEach(item => {
            let itemKey = toPositionKey({y: item, x})
            if (map.get(itemKey) !== Const.EMPTY) {
              map.set(toPositionKey({y: item + 1, x}), map.get(itemKey))
              map.set(itemKey, Const.EMPTY)
            }
          })
        }
      }
    }
  }

  if (direction === Direction.LEFT) {
    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let key = toPositionKey({y: y, x: x})
        let mergeKey = toPositionKey({y: y, x: x + 1})
        let value = map.get(key)
        let mergeValue = map.get(mergeKey)
        if (value !== Const.EMPTY && value === mergeValue) {
          map.set(key, value * 2)
          map.set(mergeKey, Const.EMPTY)
          // 右边的往左移动一格
          _.range(x + 1, maxX + 1).forEach(item => {
            let itemKey = toPositionKey({y, x: item})
            if (map.get(itemKey) !== Const.EMPTY) {
              map.set(toPositionKey({y, x: item - 1}), map.get(itemKey))
              map.set(itemKey, Const.EMPTY)
            }
          })
        }
      }
    }
  }

  if (direction === Direction.RIGHT) {
    for (let x = maxX; x > minX; x--) {
      for (let y = minY; y <= maxY; y++) {
        let key = toPositionKey({y: y, x: x})
        let mergeKey = toPositionKey({y: y, x: x - 1})
        let value = map.get(key)
        let mergeValue = map.get(mergeKey)
        if (value !== Const.EMPTY && value === mergeValue) {
          map.set(key, value * 2)
          map.set(mergeKey, Const.EMPTY)
          // 左边的往右移动一格
          _.range(x - 1, minX - 1).forEach(item => {
            let itemKey = toPositionKey({y, x: item})
            if (map.get(itemKey) !== Const.EMPTY) {
              map.set(toPositionKey({y, x: item + 1}), map.get(itemKey))
              map.set(itemKey, Const.EMPTY)
            }
          })
        }
      }
    }
  }
}

/**
 * 渲染数字
 * @param game
 */
const draw = (game: IGame) => {
  const {map} = game
  let {position, num} = generate(game)
  map.set(toPositionKey(position), num)
}

/**
 * 是否移动过
 * @param game
 */
const isMoved = (game: IGame) => {
  const {map, previousMap} = game
  if (!previousMap) {
    return true
  }
  let keys = map.keys()
  for (const key of keys) {
    if (map.get(key) !== previousMap.get(key)) {
      return true
    }
  }
  return false
}

/**
 * 是否结束
 * @param game
 */
const isEnd = (game: IGame) => {
  let map = game.map
  for (const key of map.keys()) {
    if (map.get(key) === Const.EMPTY) {
      return false
    }
  }
  for (const key of map.keys()) {
    let {y, x} = fromPositionKey(key)
    // 上下左右是否有相同的值
    let connectedKeys: string[] = [
      toPositionKey({y: y - 1, x}),
      toPositionKey({y: y + 1, x}),
      toPositionKey({y, x: x - 1}),
      toPositionKey({y, x: x + 1})
    ]
    for (const connectedKey of connectedKeys) {
      if (map.has(connectedKey) && map.get(connectedKey) === map.get(key)) {
        return false
      }
    }
  }
  return true
}

/**
 * 生成一个方块
 * @param game
 */
export const generate = (game: IGame): ICell => {
  let map = game.map
  let keys = getMapKeys(map)
  let key = _.sample(keys.filter(item => map.get(item) === Const.EMPTY))
  let num = _.sample([2, 4, 2, 8, 2, 4, 2])!
  return {position: fromPositionKey(key!), num}
}

/**
 * 重置游戏
 * @param grid
 */
export const reset = (grid: ISetting): IGame => {
  const {rows, cols} = grid
  const map = new Map<string, any>()
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let key = i + '-' + j
      map.set(key, Const.EMPTY)
    }
  }

  let keys = getMapKeys(map)
  let randomKeys: string[] = []
  for (let i = 0; i < 2; i++) {
    randomKeys.push(_.sample(keys.filter(item => !randomKeys.includes(item)))!)
  }
  for (const randomKey of randomKeys) {
    map.set(randomKey, 2)
  }

  return {
    map,
    minX: 0,
    maxX: cols - 1,
    minY: 0,
    maxY: rows - 1,
    next: false,
    status: Status.START
  }
}
