import {Direction, IShape} from './types'
import {IPosition} from 'components/Game/types'
import _ from 'lodash'

const TYPES = ['A1', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4']

/**
 * 创建形状,四个点的顺序：从上到下，从左到右，一行一行往下画
 * @param type
 * @param position
 */
export const create = (type: string, position: IPosition): IShape => {
  const {y, x} = position
  switch (type) {
    // 田字
    case 'A1':
      return {type, points: [{y, x}, {y, x: x + 1}, {y: y + 1, x}, {y: y + 1, x: x + 1}]}
    // 直线
    case 'B1':
      return {type, points: [{y, x}, {y, x: x + 1}, {y, x: x + 2}, {y, x: x + 3}]}
    case 'B2':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 2, x}, {y: y + 3, x}]}
    // 山字
    case 'C1':
      return {type, points: [{y, x}, {y: y + 1, x: x - 1}, {y: y + 1, x}, {y: y + 1, x: x + 1}]}
    case 'C2':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 1, x: x + 1}, {y: y + 2, x}]}
    case 'C3':
      return {type, points: [{y, x}, {y, x: x + 1}, {y, x: x + 2}, {y: y + 1, x: x + 1}]}
    case 'C4':
      return {type, points: [{y, x}, {y: y + 1, x: x - 1}, {y: y + 1, x}, {y: y + 2, x}]}
    // 正Z
    case 'D1':
      return {type, points: [{y, x}, {y, x: x + 1}, {y: y + 1, x: x + 1}, {y: y + 1, x: x + 2}]}
    case 'D2':
      return {type, points: [{y, x}, {y: y + 1, x: x - 1}, {y: y + 1, x}, {y: y + 2, x: x - 1}]}
    // 反Z
    case 'E1':
      return {type, points: [{y, x}, {y, x: x + 1}, {y: y + 1, x: x - 1}, {y: y + 1, x}]}
    case 'E2':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 1, x: x + 1}, {y: y + 2, x: x + 1}]}
    // 正L
    case 'F1':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 1, x: x + 1}, {y: y + 1, x: x + 2}]}
    case 'F2':
      return {type, points: [{y, x}, {y, x: x + 1}, {y: y + 1, x}, {y: y + 2, x}]}
    case 'F3':
      return {type, points: [{y, x}, {y, x: x + 1}, {y, x: x + 2}, {y: y + 1, x: x + 2}]}
    case 'F4':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 2, x}, {y: y + 2, x: x - 1}]}
    // 反L
    case 'G1':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 1, x: x - 1}, {y: y + 1, x: x - 2}]}
    case 'G2':
      return {type, points: [{y, x}, {y: y + 1, x}, {y: y + 2, x}, {y: y + 2, x: x + 1}]}
    case 'G3':
      return {type, points: [{y, x}, {y, x: x + 1}, {y, x: x + 2}, {y: y + 1, x}]}
    case 'G4':
      return {type, points: [{y, x}, {y, x: x + 1}, {y: y + 1, x: x + 1}, {y: y + 2, x: x + 1}]}
  }
  return {type, points: []}
}

/**
 * 变形
 * @param shape
 */
export const change = (shape: IShape): IShape => {
  let first = shape.type[0]
  let group = TYPES.filter(v => v.startsWith(first))
  let order = group.indexOf(shape.type)
  order = order + 1 >= group.length ? 0 : order + 1
  let nextType = group[order]
  let p1 = shape.points![0]
  switch (nextType) {
    // 田字
    case 'A1':
      return create(nextType, p1)
    // 直线
    case 'B1':
      return create(nextType, {y: p1.y + 1, x: p1.x - 1})
    case 'B2':
      return create(nextType, {y: p1.y - 1, x: p1.x + 1})
    // 山字
    case 'C1':
      return create(nextType, p1)
    case 'C2':
      return create(nextType, p1)
    case 'C3':
      return create(nextType, {y: p1.y + 1, x: p1.x - 1})
    case 'C4':
      return create(nextType, {y: p1.y - 1, x: p1.x + 1})
    // 正Z
    case 'D1':
      return create(nextType, {y: p1.y + 1, x: p1.x - 1})
    case 'D2':
      return create(nextType, {y: p1.y - 1, x: p1.x + 1})
    // 反Z
    case 'E1':
      return create(nextType, {y: p1.y + 1, x: p1.x + 1})
    case 'E2':
      return create(nextType, {y: p1.y - 1, x: p1.x - 1})
    // 正L
    case 'F1':
      return create(nextType, {y: p1.y + 1, x: p1.x})
    case 'F2':
      return create(nextType, {y: p1.y + 1, x: p1.x})
    case 'F3':
      return create(nextType, {y: p1.y, x: p1.x - 2})
    case 'F4':
      return create(nextType, {y: p1.y - 2, x: p1.x + 2})
    // 反L
    case 'G1':
      return create(nextType, {y: p1.y - 1, x: p1.x + 1})
    case 'G2':
      return create(nextType, {y: p1.y - 1, x: p1.x})
    case 'G3':
      return create(nextType, {y: p1.y + 2, x: p1.x})
    case 'G4':
      return create(nextType, {y: p1.y, x: p1.x - 1})
  }

  return create(nextType, p1)
}

/**
 * 移动
 * @param shape
 * @param direction
 */
export const move = (shape: IShape, direction: Direction): IShape => {
  let {points} = shape

  switch (direction) {
    case Direction.DOWN:
      return {
        ...shape, points: points?.map(v => {
          return {y: v.y + 1, x: v.x}
        })
      }
    case Direction.LEFT:
      return {
        ...shape, points: points?.map(v => {
          return {y: v.y, x: v.x - 1}
        })
      }
    case Direction.RIGHT:
      return {
        ...shape, points: points?.map(v => {
          return {y: v.y, x: v.x + 1}
        })
      }
  }
  return shape
}

/**
 * 随机一个
 * @param p
 */
export const random = (p: IPosition): IShape => {
  let type = _.sample(['A1', 'B1', 'C1', 'D1', 'F1', 'A1', 'B1', 'C1', 'E1', 'G1'])!
  switch (type) {
    case 'A1':
      return create(type, {...p, x: p.x - 2})
    case 'B1':
      return create(type, {...p, x: p.x - 2})
    case 'C1':
      return create(type, {...p, x: p.x - 1})
    case 'D1':
      return create(type, {...p, x: p.x - 2})
    case 'E1':
      return create(type, {...p, x: p.x - 1})
    case 'F1':
      return create(type, {...p, x: p.x - 2})
  }
  return create(type, p)
}



