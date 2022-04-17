/**
 * 设置
 */
import {IPosition} from 'components/Game/types'

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
  map: Map<string, SquareType>
  // 头部
  header: IPosition
  // 身体
  body: IPosition[]
  // 食物
  food: IPosition
  // 方向
  direction: Direction
  // 状态
  status: Status
}

/**
 * 动作
 */
export interface IAction {
  // 动作类型
  type: ActionType
  // 动作负载(携带的数据)
  payload?: Direction | Status | ISetting
}

/**
 * 动作类型
 */
export enum ActionType {
  // 前进
  RUN,
  /// 转弯
  TURN,
  // 重置
  RESET,
  // 改变状态
  CHANGE_STATUS
}

/**
 * 方块类型
 */
export enum SquareType {
  // 默认类型
  DEFAULT = 'default',
  // 食物
  FOOD = 'food',
  // 头
  HEADER = 'header',
  // 身体
  BODY = 'body'
}

/**
 * 方向
 */
export enum Direction {
  // 上
  UP,
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
