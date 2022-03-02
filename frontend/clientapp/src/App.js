import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/core/footer/Footer";
import Navbar from "./components/core/nav/Navbar";
import Welcome from "./components/pages/welcome/Welcome";
import Login from "./components/pages/login/Login.js";
import Profilepage from "./components/pages/profile/Profilepage";
import FeedPosts from "./components/pages/feed/FeedPosts";
import MainStandPage from "./components/pages/standings/MainStandPage";

import CreateUser from "./components/pages/login/CreateUser";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Function to validate if user is logged in
  async function validateIfIserIsLoggedIn() {
    if (localStorage.getItem("loggedIn")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }
  useEffect(() => {
    validateIfIserIsLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <div className="application">
        <div className="nav">
          <Navbar />
        </div>

        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<Profilepage />} />
            {isLoggedIn ? (
              <Route path="/feed" element={<FeedPosts />} />
            ) : (
              <Route path="/signup" element={<CreateUser />} />
            )}

            <Route path="/signup" element={<CreateUser />} />

            <Route path="/" element={<MainStandPage />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
