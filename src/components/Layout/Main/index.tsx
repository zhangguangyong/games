import {FC, ReactElement} from 'react'
import {Outlet} from 'react-router-dom'

export const Main: FC = (): ReactElement => {
  return (
    <Outlet/>
  )
}
