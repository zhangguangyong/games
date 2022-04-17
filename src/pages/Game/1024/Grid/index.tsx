import React, {FC, ReactElement, useContext} from 'react'
import {Cell} from '../Cell'
import {GameContext} from '../contexts'

export const Grid: FC = (): ReactElement => {
  const {state, setting} = useContext(GameContext)!
  const {rows, cols, height, width} = setting

  const style: React.CSSProperties = {
    height: (rows * height + rows * 10 + 10) + 'px',
    width: (cols * width + cols * 10 + 10) + 'px',
  }
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
