import {FC, ReactElement} from 'react'
import './index.scss'
import {Main} from 'components/Layout/Main'

export const Layout: FC = (): ReactElement => {
  return (
    <div className="layout-component">
      <div className="main">
        <Main/>
      </div>
    </div>
  )
}
