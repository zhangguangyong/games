/**
 * 共享
 */
import {IPosition} from 'pages/Game/types'

export interface IContext {
  state: IGame
  dispatch: (action: IAction) => void
  setting: ISetting,
  setSetting: (setting: ISetting) => void
  handleAction: () => void
}

/**
 * 设置
 */
export interface ISetting {
  // 行数
  rows: number
  // 列数
  cols: number
  // 宽度
  width: number
  // 高度
  height: number
  // 速度
  speed: number
}

/**
 * 默认设置
 */
export const DefaultSetting: ISetting = {
  rows: 20,
  cols: 20,
  width: 30,
  height: 30,
  speed: 1,
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
  type?: CellType
}

/**
 * 游戏
 */
export interface IGame {
  // 地图
  map: Map<string, CellType>
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
export enum CellType {
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

/**
 * 单元格类型与图标的映射
 */
export const CellTypeIconMap: Map<CellType, string[]> = new Map([
  [CellType.DEFAULT, ['']],
  [CellType.HEADER, ['sheshe']],
  [CellType.BODY, ['youleyuan']],
  [CellType.FOOD, ['lanqiu', 'taiqiu', 'duoseqiu', 'wangqiu', 'lanqiu1', 'lanqiu2', 'piqiu', 'diqiu', 'a-diqiuxingqiu', 'a-qiuhaiyangqiuyouxi']]
])


export const KeyDirectionMap = new Map<string, Direction>([
  ['ArrowUp', Direction.UP],
  ['ArrowDown', Direction.DOWN],
  ['ArrowLeft', Direction.LEFT],
  ['ArrowRight', Direction.RIGHT],

  ['w', Direction.UP],
  ['s', Direction.DOWN],
  ['a', Direction.LEFT],
  ['d', Direction.RIGHT],

  ['i', Direction.UP],
  ['k', Direction.DOWN],
  ['j', Direction.LEFT],
  ['l', Direction.RIGHT]
])
