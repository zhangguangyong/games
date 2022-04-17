import React, {FC, ReactElement, useContext} from 'react'
import {GameContext} from '../contexts'
import {Status} from '../types'
import {Const, toPositionKey} from 'utils'
import {Cell} from 'pages/Game/Tetris/Cell'
import {Button} from 'antd'

/**
 * 控制面板
 * @constructor
 */
export const Control: FC = (): ReactElement => {
  let {state, setting, handleAction} = useContext(GameContext)!
  const {rows, height} = setting
  const {status} = state

  /**
   * 显示下一个
   */
  const renderNext = () => {
    let type = state.next.type.substring(0, 1)
    let keys = state.next.points!.map(item => toPositionKey(item))
    return (
      <div>
        {
          Array.from(Array(2)).map((e, row) => (
            <div className="row" key={row} style={{display: 'flex'}}>
              {
                Array.from(Array(4)).map((e, column) => {
                    let position = {y: row, x: column + 3}
                    let key = toPositionKey(position)
                    return (
                      <Cell key={key}
                            position={position}
                            width={setting.width}
                            height={setting.height}
                            fill={keys.includes(key) ? type : Const.EMPTY}
                      />
                    )
                  }
                )
              }
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div className="control" style={{height: rows * height}}>
      <div>
        <Button type="primary" size="small" danger={status === Status.END} onClick={handleAction}>
          {status === Status.PREPARE ? '开始游戏' : status === Status.END ? '重新开始' : status === Status.START ? '暂停' : '启动'}
        </Button>
      </div>
      <div>
        <div>分数</div>
        <div className="num">{state.score}</div>
      </div>
      <div>
        <div>等级</div>
        <div className="num">{state.level}</div>
      </div>
      <div>
        <div>行数</div>
        <div className="num">{state.rows}</div>
      </div>
      <div>
        下一个
      </div>
      <div>
        {renderNext()}
      </div>

      {/*<div>*/}
      {/*  <div>行数</div>*/}
      {/*  <InputNumber*/}
      {/*    size={size}*/}
      {/*    min={10}*/}
      {/*    defaultValue={setting.rows}*/}
      {/*    onChange={(value: number) => {*/}
      {/*      setSetting({...setting, rows: value})*/}
      {/*    }}/>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <div>列数</div>*/}
      {/*  <InputNumber*/}
      {/*    size={size}*/}
      {/*    min={10}*/}
      {/*    defaultValue={setting.cols}*/}
      {/*    onChange={(value: number) => {*/}
      {/*      setSetting({...setting, cols: value})*/}
      {/*    }}/>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <div>大小</div>*/}
      {/*  <InputNumber*/}
      {/*    size={size}*/}
      {/*    min={10}*/}
      {/*    defaultValue={setting.height}*/}
      {/*    onChange={(value: number) => {*/}
      {/*      setSetting({...setting, width: value, height: value})*/}
      {/*    }}/>*/}
      {/*</div>*/}
    </div>
  )
}
