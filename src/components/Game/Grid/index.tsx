import {FC, ReactElement} from 'react'
import {Cell} from 'components/Game/Cell'
import {IGrid} from 'components/Game/types'

export const Grid: FC<IGrid> = (props): ReactElement => {
  const {rows, cols, width, height, children, style, cellStyle} = props
  return (
    <div className="game-grid"
         style={{
           height: (rows * height) + 'px',
           width: (cols * width) + 'px',
           ...style
         }}
    >
      {
        Array.from(Array(rows)).map((e, row) => (
          <div key={row} className="row">
            {
              Array.from(Array(cols)).map((e, col) => {
                  let position = {y: row, x: col}
                  return (
                    <Cell
                      key={row + '-' + col}
                      position={position}
                      width={width}
                      height={height}
                      style={cellStyle && cellStyle({position})}
                    >
                      {children && children({position, width, height})}
                    </Cell>
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
