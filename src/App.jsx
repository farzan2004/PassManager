import React from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Manager from './components/Manager'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'


function App() {
  return (
    <Router>
      <Navbar />
      <div className='min-h-[90vh]'>
      {/* <Manager /> */}
        <Routes>
          <Route path="/" element={<Manager/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
