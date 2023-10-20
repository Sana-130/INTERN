
import './App.css'
import {Routes, Route} from "react-router-dom";
import {Home, Register} from './pages'


function App() {
  

  return (
    <Routes>
      <Route index element={<Home/>} />
      <Route path='/signup' element={<Register />} />
    </Routes>
   
  )
}

export default App
