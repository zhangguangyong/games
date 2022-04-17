import {IPosition} from 'components/Game/types'

/**
 * 设置
 */
export interface ISetting {
  // 行数
  rows: number
  // 列数
  cols: number
  // 行数
  width: number
  // 列数
  height: number
  // 速度
  speed: number
}

/**
 * 游戏
 */
export interface IGame {
  // 地图
  map: Map<string, string>
  minY: number
  maxY: number
  minX: number
  maxX: number
  // 形状
  shape?: IShape
  // 下一个
  next: IShape
  // 锁住
  locked: boolean
  // 得分行
  scoreRows: number[]
  // 分数
  score: number
  // 等级
  level: number
  // 行数
  rows: number
  // 状态
  status?: Status
}


/**
 * 形状
 */
export interface IShape {
  // 类型
  type: string
  // 点
  points?: IPosition[]
}

/**
 * 动作
 */
export interface IAction {
  // 动作类型
  type: ActionType
  // 动作负载(携带的数据)
  payload?: IShape | Direction | any
}

/**
 * 动作类型
 */
export enum ActionType {
  // 下落
  RUN,
  // 渲染
  DRAW,
  // 变形
  CHANGE,
  // 移动
  MOVE,
  // 一键
  ONE_KEY,
  // 得分
  SCORE,
  // 状态
  STATUS,
  // 重置
  RESET
}

/**
 * 移动方向
 */
export enum Direction {
  // 下
  DOWN,
  // 左
  LEFT,
  // 右
  RIGHT
}

/**
 * 状态
 */
export enum Status {
  // 未开始
  PREPARE,
  // 运行中
  START,
  // 已暂停
  STOP,
  // 已结束
  END
}
