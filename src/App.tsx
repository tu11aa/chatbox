import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatbox from "./Pages/Chatbox";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* @ts-ignore */}
          <Route exact path="/" element={<Login />} />
          <Route path="/chatbox" element={<Chatbox />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
