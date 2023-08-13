import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { CSRFToken } from './types'
import './App.css'
import { Auth } from './components/Auth'
import { Todo } from './components/Todo'

function App() {
  useEffect(() => {
    axios.defaults.withCredentials = true
    const getCSRFToken = async () => {
      const { data } = await axios.get<CSRFToken>(
        `${process.env.REACT_APP_API_URL}/csrf`
      )
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
    }
    getCSRFToken()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
