import { useState } from 'react'
import { AuthProvider } from './contexts/authContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import StudentProfileSetup from './components/FaceRegister'; // Registers Face of the Student

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white relative overflow-hidden">
          <Routes>
            <Route path='/' element={< SignUp />}/>
            <Route path='/SignUp' element={< SignUp />}/>
            <Route path='/Login' element={ <Login /> }/>
            <Route path='/StudentDashboard' element={ < StudentDashboard /> }/>
            <Route path='/AdminDashboard' element={ < AdminDashboard /> }/>
            <Route path='/Register_Face' element={ < StudentProfileSetup /> }/>

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App