import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/core/footer/Footer";
import Navbar from "./components/core/nav/Navbar";
import Welcome from "./components/pages/welcome/Welcome";
import Feppe from "./components/feppetut/Feppe";

function App() {
  return (
    <BrowserRouter onUpdate={() => window.scrollTo(0, 0)}>
      <div className="application">
        <div className="nav">
          <Navbar />
          <Welcome />
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={""} />
            <Route path="/feppe" element={Feppe} />
            <Route path="/login" element={Welcome} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
