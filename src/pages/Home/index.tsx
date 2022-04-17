import {FC, ReactElement} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import './index.scss'
import {Radio} from 'antd'
import {GithubOutlined} from '@ant-design/icons'

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
        <GithubOutlined style={{fontSize: '25px',marginLeft:'10px'}} onClick={()=>window.open('https://github.com/zhangguangyong/games')}/>
      </div>
      <div className={'content'}>
        <Outlet/>
      </div>
    </div>
  )
}
