import React, {FC, ReactElement, useContext} from 'react'
import {Button, Space} from 'antd'
import {FullscreenExitOutlined, FullscreenOutlined, MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons'
import {ActionType, DefaultSetting, Status} from '../types'
import {reset} from '../reducers'
import {GameContext} from '../contexts'

/**
 * 控制面板
 * @constructor
 */
export const Control: FC = (): ReactElement => {
  let {state, dispatch, setting, setSetting} = useContext(GameContext)!
  const {rows, cols, height, width} = setting
  const size = 'small'

  /**
   * 重启
   */
  const handleRestart = () => {
    dispatch({type: ActionType.RESET, payload: reset(setting)})
  }

  /**
   * 重置
   */
  const handleReset = () => {
    setSetting(DefaultSetting)
    dispatch({type: ActionType.RESET, payload: reset(DefaultSetting)})
  }

  /**
   * 设置
   * @param type
   */
  const handleSetting = (type: string): void => {
    if (['+', '-'].includes(type)) {
      let v = type === '+' ? 1 : -1
      const newGrid = {...setting, rows: rows + v, cols: cols + v}
      setSetting(newGrid)
      dispatch({type: ActionType.RESET, payload: reset(newGrid)})
    }
    if (['放', '缩'].includes(type)) {
      let v = type === '放' ? 5 : -5
      setSetting({...setting, height: height + v, width: width + v})
    }
  }

  return (
    <div className="control">
      <Space>
        <Button type="primary" size={size} onClick={() => handleRestart()}
                danger={state.status === Status.END}>重新开始</Button>
        <Button type="primary" size={size} onClick={() => handleSetting('+')} icon={<PlusCircleOutlined/>}/>
        <Button type="primary" size={size} onClick={() => handleSetting('-')} icon={<MinusCircleOutlined/>}/>
        <Button type="primary" size={size} onClick={() => handleSetting('放')} icon={<FullscreenOutlined/>}/>
        <Button type="primary" size={size} onClick={() => handleSetting('缩')} icon={<FullscreenExitOutlined/>}/>
        <Button type="primary" size={size} onClick={() => handleReset()}>重置</Button>
      </Space>
    </div>
  )
}
