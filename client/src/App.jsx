import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './page/Home'
import Register from "./page/Register"
import Login from "./page/Login"
import AddCat from "./page/AddCat"
import UpdateCat from "./page/UpdateCat"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/addcat' element={<AddCat/>}></Route>
        <Route path='/update/:id' element={<UpdateCat/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
