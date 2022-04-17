import {ActionType, Direction, IAction, IGame, ISetting, IShape, Status} from '../types'
import {Const, fromPositionKey, getMapKeys, toPositionKey} from 'utils'
import {change, move, random,} from '../shape'
import _ from 'lodash'

export const gameReducer = (state: IGame, action: IAction) => {
  const {type, payload} = action
  const {map, shape, status} = state
  // 重置
  if (type === ActionType.RESET) {
    return reset(payload as ISetting)
  }

  // 改变状态
  if (type === ActionType.STATUS) {
    return {...state, status: payload as Status}
  }

  // 是否已经开启
  if (status !== Status.START) {
    return state
  }

  // 画形
  if (type === ActionType.DRAW) {
    if (isEnd(state.next, state)) {
      return {...state, status: Status.END}
    }
    state.next!.points?.forEach(item => map.set(toPositionKey(item), state.next.type))
    return {...state, map, shape: state.next, next: random({y: 0, x: Math.ceil(state.maxX / 2)}), locked: true}
  }

  // 一键
  if (type === ActionType.ONE_KEY) {
    // 一直往下移动，直到检查到不能下移为止
    let newShape = move(shape!, Direction.DOWN)
    while (check(shape!, newShape, state)) {
      newShape = move(newShape, Direction.DOWN)
    }
    // 检查会出现Y多加了1
    newShape.points = newShape.points?.map(item => {
      return {y: item.y - 1, x: item.x}
    })

    // 重画
    redraw(shape!, newShape, map)
    // 是否有得分的行
    let scoreRows = getScoreRows(state)
    let locked = scoreRows.length > 0
    return {...state, map, shape: newShape, scoreRows, locked}
  }

  // 变形
  if (type === ActionType.CHANGE) {
    let newShape = change(shape!)
    if (!check(shape!, newShape!, state)) {
      return state
    }
    redraw(shape!, change(shape!), map)
    return {...state, map, shape: newShape}
  }

  // 移动
  if (type === ActionType.MOVE) {
    let direction = payload as Direction
    let newShape = move(shape!, direction)
    // 检查
    if (!check(shape!, newShape!, state)) {
      if (direction === Direction.DOWN) {
        // 得分行
        let scoreRows = getScoreRows(state)
        return {...state, scoreRows, locked: scoreRows.length > 0}
      }
      return state
    }
    // 重画
    redraw(shape!, newShape, map)
    return {...state, map, shape: newShape}
  }

  // 得分
  if (type === ActionType.SCORE) {
    handleScoreRows(state)
    return {...state, scoreRows: [], locked: false}
  }

  return state
}

/**
 * 重画
 * @param oldShape
 * @param newShape
 * @param map
 */
const redraw = (oldShape: IShape, newShape: IShape, map: Map<string, string>) => {
  oldShape?.points?.forEach(item => map.set(toPositionKey(item), Const.EMPTY))
  newShape.points?.forEach(item => map.set(toPositionKey(item), newShape.type))
}

/**
 * 检查是否可以移动
 * @param oldShape
 * @param newShape
 * @param game
 */
const check = (oldShape: IShape, newShape: IShape, game: IGame) => {
  // 不能触碰到已存在的点
  let oldShapePoints = oldShape.points?.map(item => toPositionKey(item))!
  let newShapePoints = newShape.points?.map(item => toPositionKey(item))!
  let map = game.map
  for (const key of map.keys()) {
    if (oldShapePoints.includes(key) || map.get(key) === Const.EMPTY) {
      continue
    }
    if (newShapePoints.includes(key)) {
      return false
    }
  }

  // 不能出线
  let ys = newShape.points?.map(item => item.y)!
  let xs = newShape.points?.map(item => item.x)!
  return _.max(ys)! <= game.maxY && _.min(xs)! >= game.minX && _.max(xs)! <= game.maxX
}

/**
 * 是否结束
 * @param shape
 * @param game
 */
const isEnd = (shape: IShape, game: IGame) => {
  let map = game.map
  let shapeKeys = shape.points?.map(item => toPositionKey(item))!
  for (const key of map.keys()) {
    if (map.get(key) !== Const.EMPTY && shapeKeys.includes(key)) {
      return true
    }
  }
  return false
}

/**
 * 获取得分的行
 * @param game
 */
const getScoreRows = (game: IGame) => {
  let map = game.map
  let scoreRows = []
  let minX = game.minX
  let maxX = game.maxX
  for (let i = game.maxY; i >= game.minY; i--) {
    let flag = true
    for (let j = minX; j <= maxX; j++) {
      if (map.get(i + '-' + j) === Const.EMPTY) {
        flag = false
        break
      }
    }
    if (flag) {
      scoreRows.push(i)
    }
  }
  return scoreRows
}

/**
 * 处理得分的行
 * @param game
 */
const handleScoreRows = (game: IGame) => {
  let scoreRows = game.scoreRows
  let size = scoreRows.length
  if (!size) {
    return
  }
  let map = game.map
  let keys = getMapKeys(map)
  // 当前行消除
  for (const scoreRow of scoreRows) {
    keys.filter(item => item.startsWith(scoreRow + '-')).forEach(item => map.set(item, Const.EMPTY))
  }
  // 将上面的行将落下来
  // 1.找到需要下降的key
  let downKeys = keys.filter(item => !scoreRows.includes(fromPositionKey(item).y) && map.get(item) !== Const.EMPTY)
  // 2.先删除颜色，删除前记录下来
  let downKeyColorMap = new Map<string, string>()
  downKeys.forEach(item => {
    downKeyColorMap.set(item, map.get(item)!)
    map.set(item, Const.EMPTY)
  })
  // 3.下降多少行=比你大的消除行累加，涂色
  downKeys.forEach(item => {
    let p = fromPositionKey(item)
    let length = scoreRows.filter(item => item > p.y).length
    map.set(toPositionKey({y: p.y + length, x: p.x}), downKeyColorMap.get(item)!)
  })
  // 行数/等级/分数
  game.rows += size
  game.level = Math.floor(game.rows / 10)
  game.score += size === 1 ? 100 : size === 2 ? 300 : size === 3 ? 600 : 1000
}

/**
 * 重置
 * @param setting
 */
export const reset = (setting: ISetting): IGame => {
  const map = new Map<string, string>()
  for (let i = 0; i < setting.rows; i++) {
    for (let j = 0; j < setting.cols; j++) {
      let key = i + '-' + j
      map.set(key, '')
    }
  }
  return {
    map,
    // todo 需要调整
    next: random({y: 0, x: Math.ceil(setting.cols / 2)}),
    minY: 0,
    maxY: setting.rows - 1,
    minX: 0,
    maxX: setting.cols - 1,
    locked: false,
    scoreRows: [],
    score: 0,
    level: 0,
    rows: 0,
    status: Status.PREPARE
  }
}
