export interface IContext {
  state: IGame,
  dispatch: (action: IAction) => void
}

/**
 * 游戏
 */
export interface IGame {
  // 地图
  map: Map<string, any>
  minX: number
  maxX: number
  minY: number
  maxY: number
  next: boolean
  // 上一个地图
  previousMap?: Map<string, any>
  // 状态
  status?: Status
}

/**
 * 二维表格
 */
export interface IGrid {
  // 行数
  rows: number
  // 列数
  cols: number
  // 高度
  height: number
  // 宽度
  width: number
}

/**
 * 表格中的单元格
 */
export interface ICell {
  // 位置
  position: IPosition
  // 宽度
  width?: number
  // 高度
  height?: number
  // 数字
  num?: number
}


/**
 * 位置
 */
export interface IPosition {
  // 列
  x: number
  // 行
  y: number
}


/**
 * 动作
 */
export interface IAction {
  // 动作类型
  type: ActionType
  // 动作负载(携带的数据)
  payload?: Direction | IGame | any
}

/**
 * 动作类型
 */
export enum ActionType {
  // 渲染
  DRAW,
  // 移动
  MOVE,
  // 重置
  RESET
}

/**
 * 移动方向
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
  // 运行中
  START,
  // 已结束
  END
}
