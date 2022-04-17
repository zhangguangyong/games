import React, {FC, ReactElement, useContext} from 'react'
import {IGrid} from 'pages/Game/1024/types'
import {Cell} from 'pages/Game/1024/Cell'
import {GameContext} from 'pages/Game/1024/contexts'

export const Grid: FC<IGrid> = (props): ReactElement => {
  const {rows, cols, height, width} = props
  const style: React.CSSProperties = {
    height: rows * height + 50,
    width: cols * width + 50
  }
  let {state} = useContext(GameContext)!
  const render = () => {
    return (
      <div className="grid" style={style}>
        {
          // 行
          Array.from(Array(rows))
            .map((v, row) => (
              <div key={row} className="row">
                {
                  // 列
                  Array.from(Array(cols)).map((v, col) =>
                    (
                      <Cell key={row + '-' + col}
                            position={{y: row, x: col}}
                            height={height}
                            width={width}
                            num={state.map.get(row + '-' + col)}
                      />
                    )
                  )
                }
              </div>
            ))
        }
      </div>
    )
  }

  return render()
}
