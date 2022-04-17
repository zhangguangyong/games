import React, {FC} from 'react'
import './App.css'
import {Layout} from 'components/Layout'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Home} from 'pages/Home'

const App: FC = () => (
  <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
        </Route>
      </Routes>
    </div>
  </BrowserRouter>
)

export default App
