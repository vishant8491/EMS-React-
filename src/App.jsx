import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'
import { getLocalStorage, setLocalStorage } from './utils/localStorage'

const App = () => {

  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData] = useContext(AuthContext)

  useEffect(()=>{
    const loggedInUser = localStorage.getItem('loggedInUser')
    
    if(loggedInUser){
      const userData = JSON.parse(loggedInUser)
      setUser(userData.role)
      setLoggedInUserData(userData.data)
    }

  },[])


  const handleLogin = (email, password) => {
    // Ensure default seed data exists even if localStorage was cleared manually
    setLocalStorage()

    const { admin: storedAdmin = [], employees: seededEmployees = [] } = getLocalStorage() || {}
    const adminMatch = storedAdmin.find((admin) => admin.email === email && admin.password === password)

    if (adminMatch) {
      setUser('admin')
      setLoggedInUserData(adminMatch)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: adminMatch }))
      return
    }

    const employeeSource = (userData && userData.length > 0) ? userData : seededEmployees
    const employee = employeeSource.find((employee) => employee.email === email && employee.password === password)
    if (employee) {
      setUser('employee')
      setLoggedInUserData(employee)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }))
      return
    }

    alert('Invalid Credentials')
  }



  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user == 'admin' ? <AdminDashboard changeUser={setUser} /> : (user == 'employee' ? <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> : null) }
    </>
  )
}

export default App