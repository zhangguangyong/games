import {FC, ReactElement} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import './index.scss'
import {Radio} from 'antd'

export const Home: FC = (): ReactElement => {
  let navigate = useNavigate()

  const handleChange = (e: any) => {
    navigate('/' + e.target.value)
  }

  return (
    <div className={'home-page'}>
      <div className="top">
        <Radio.Group defaultValue="snake" buttonStyle="solid" onChange={handleChange}>
          <Radio.Button value="snake">贪吃蛇</Radio.Button>
          <Radio.Button value="tetris">俄罗斯方块</Radio.Button>
          <Radio.Button value="1024">1024</Radio.Button>
        </Radio.Group>

      </div>
      <div className={'content'}>
        <Outlet/>
      </div>
    </div>
  )
}
