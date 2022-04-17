import React, {FC} from 'react'
import './App.css'
import {Layout} from 'components/Layout'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {Home} from 'pages/Home'
import {GameSnake} from 'pages/Game/Snake'
import {GameTetris} from 'pages/Game/Tetris'
import {Game1024} from 'pages/Game/1024'

const App: FC = () => (
  <BrowserRouter basename={'/games'}>
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Navigate to="/snake"/>}/>
          <Route path="" element={<Home/>}>
            <Route path="snake" element={<GameSnake/>}/>
            <Route path="tetris" element={<GameTetris/>}/>
            <Route path="1024" element={<Game1024/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  </BrowserRouter>
)

export default App
