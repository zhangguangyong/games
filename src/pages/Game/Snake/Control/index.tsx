import React, {FC, ReactElement, useContext} from 'react'
import {GameContext} from '../contexts'
import {ActionType, Status} from 'pages/Game/Snake/types'
import {Button} from 'antd'

/**
 * 控制面板
 * @constructor
 */
export const Control: FC = (): ReactElement => {
  let {state, dispatch, setting, setSetting, handleAction} = useContext(GameContext)!
  const {status} = state
  const {rows, cols, height, width, speed} = setting
  const size = 'small'

  /**
   * 渲染设置
   */
  const renderSetting = () => {
    const enabled: boolean = status === Status.PREPARE || status === Status.END
    const isStart = status === Status.START
    const size = 'small'
    return (
      ['速', '行', '列', '宽', '高'].map((item) => (
        <div key={item}>
          <span>{item}</span>
          <Button disabled={item === '速' ? isStart : !enabled} onClick={() => handleSetting('+', item)}
                  size={size}>+</Button>
          <span>
            {item === '速' ? speed : item === '行' ? rows : item === '列' ? cols : item === '宽' ? width : item === '高' ? height : ''}
          </span>
          <Button disabled={item === '速' ? isStart : !enabled} onClick={() => handleSetting('-', item)}
                  size={size}>-</Button>
        </div>
      ))
    )
  }


  /**
   * 设置
   * @param type
   * @param item
   */
  const handleSetting = (type: string, item: string): void => {
    let v: number = type === '+' ? 1 : -1
    switch (item) {
      case '速':
        setSetting({...setting, speed: speed + v})
        return
      case '行':
        setSetting({...setting, rows: rows + v})
        break
      case '列':
        setSetting({...setting, cols: cols + v})
        break
      case '宽':
        setSetting({...setting, width: width + v})
        break
      case '高':
        setSetting({...setting, height: height + v})
        break
    }
    dispatch({type: ActionType.RESET, payload: setting})
    return
  }

  return (
    <div className="control" style={{width: cols * width + 'px'}}>
      <div>
        <Button
          size={size}
          type={'primary'}
          danger={status === Status.END}
          onClick={handleAction}>
          {
            (status === Status.PREPARE) ? '开始' : status === Status.END ? '重来' : status === Status.START ? '暂停' : '启动'
          }
        </Button>
      </div>
      <div>分数：<span style={{color: 'red'}}>{state.body.length}</span></div>
      {
        renderSetting()
      }
    </div>
  )
}
