import {ActionType, CellType, Direction, IAction, IGame, ISetting, Status} from '../types'
import {toPositionKey} from 'utils'
import {IPosition} from 'pages/Game/types'

export const gameReducer = (state: IGame, action: IAction) => {
  const {type, payload} = action
  if (type === ActionType.RESET) {
    return reset(payload as ISetting)
  }

  if (type === ActionType.CHANGE_STATUS) {
    return {...state, status: payload as Status}
  }

  if (state.status !== Status.START) {
    return state
  }

  let {map, header, body, food, direction} = state
  // 如果转弯，则立即更换方向
  if (type === ActionType.TURN) {
    direction = payload as Direction
  }

  let newHeader: IPosition = {x: 0, y: 0}
  switch (direction) {
    case Direction.UP:
      newHeader = {x: header.x, y: header.y - 1}
      break
    case Direction.DOWN:
      newHeader = {x: header.x, y: header.y + 1}
      break
    case Direction.LEFT:
      newHeader = {x: header.x - 1, y: header.y}
      break
    case Direction.RIGHT:
      newHeader = {x: header.x + 1, y: header.y}
      break
  }

  // 撞墙游戏结束
  if (!map.has(toPositionKey(newHeader))) {
    return {...state, status: Status.END}
  }

  // 吃到自己游戏结束
  if (body.length) {
    let bodyKeys = body.map(v => toPositionKey(v))
    bodyKeys.pop()
    if (bodyKeys.includes(toPositionKey(newHeader))) {
      return {...state, status: Status.END}
    }
  }

  // 改变头部
  map.set(toPositionKey(newHeader), CellType.HEADER)
  // 是否吃到了食物
  let eatenFood = toPositionKey(newHeader) === toPositionKey(food)
  // 设置原来的头部
  map.set(toPositionKey(header), eatenFood ? CellType.BODY : CellType.DEFAULT)
  // 身体
  let newBody = [...body]
  // 吃到食物
  if (eatenFood) {
    newBody = [header, ...newBody]
  } else if (newBody.length) {
    // 未吃到食物，移除身体的最后一个节点
    let removed = newBody.pop()!
    newBody = [header, ...newBody]
    map.set(toPositionKey(header), CellType.BODY)
    map.set(toPositionKey(removed), CellType.DEFAULT)
  }

  // 生成食物
  let newFood = {...food}
  if (eatenFood) {
    // 随机一个坐标
    let excludeKeys = newBody.map(v => toPositionKey(v)).concat([toPositionKey(newHeader)])
    let availableKeys: string[] = []
    for (const key of map.keys()) {
      if (!excludeKeys.includes(key)) {
        availableKeys.push(key)
      }
    }
    let randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)]
    let yx = randomKey.split('-')
    newFood = {y: +yx[0], x: +yx[1]}
    map.set(toPositionKey(newFood), CellType.FOOD)
  }

  return {
    ...state,
    direction,
    header: newHeader,
    body: newBody,
    food: newFood,
    map: new Map(map)
  }
}

export const reset = (setting: ISetting): IGame => {
  const map = new Map<string, CellType>()
  for (let i = 0; i < setting.rows; i++) {
    for (let j = 0; j < setting.cols; j++) {
      let key = i + '-' + j
      map.set(key, CellType.DEFAULT)
    }
  }

  // 头
  let header = {y: 0, x: 0}
  let headerKey = toPositionKey(header)

  // 随机食物
  let keys = [...map.keys()]
  let foodKeys = keys.filter(k => k !== headerKey)
  let foodKey = foodKeys[Math.floor(Math.random() * foodKeys.length)]
  let foodYX = foodKey.split('-')
  let food = {y: +foodYX[0], x: +foodYX[1]}

  for (const key of keys) {
    if (key === headerKey) {
      map.set(key, CellType.HEADER)
      continue
    }
    if (key === foodKey) {
      map.set(key, CellType.FOOD)
      continue
    }
    map.set(key, CellType.DEFAULT)
  }

  return {
    map,
    header,
    body: [],
    food,
    direction: Direction.DOWN,
    status: Status.PREPARE
  }
}
