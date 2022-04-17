import React, {FC, ReactElement, useContext} from 'react'
import {Cell} from '../Cell'
import {GameContext} from '../contexts'

export const Grid: FC = (): ReactElement => {
  let {state, setting} = useContext(GameContext)!
  let {rows, cols, height, width} = setting

  const render = () => {
    return (
      <div className="grid" style={{height: rows * height, width: cols * width}}>
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
                            type={state.map.get(row + '-' + col)}
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
