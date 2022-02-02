import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/core/footer/Footer";
import Navbar from "./components/core/nav/Navbar";
import Welcome from "./components/pages/welcome/Welcome";
import Feppe from "./components/feppetut/Feppe";

function App() {
<<<<<<< HEAD
<<<<<<< HEAD
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Tester branchen min:) <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
=======
  return <div className="App"></div>;
>>>>>>> bd9969669914b87deff7fdaf4a36ff0d19b676e0
=======
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
>>>>>>> cb1b5145ccca181282b0a7c10f91675f031d3dd6
}

export default App;
