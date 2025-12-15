import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import IA from "./pages/Ia"
import AvisoLegal from "./pages/AvisoLegal"
import PoliticaDePrivacidad from "./pages/PoliticaDePrivacidad"


function App() {
  return (
    <Router>
      <Header />
      <main className="container my-4" style={{ minHeight: "100vh"}}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/ia" element={<IA/>}/>
          <Route path="/aviso-legal" element={<AvisoLegal/>}/>
          <Route path="/politica-de-privacidad" element={<PoliticaDePrivacidad/>}/>
        </Routes>
      </main>
      <Footer/>
    </Router>
  )
}

export default App