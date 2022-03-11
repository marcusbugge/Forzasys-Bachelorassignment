import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/core/footer/Footer";
import Navbar from "./components/core/nav/Navbar";
import Welcome from "./components/pages/welcome/Welcome";
import Login from "./components/pages/login/Login.js";
import Profilepage from "./components/pages/profile/Profilepage";
import FeedPosts from "./components/pages/feed/FeedPosts";
import MainStandPage from "./components/pages/standings/MainStandPage";
import { Navigate } from "react-router-dom";
import CreateUser from "./components/pages/login/CreateUser";
import { useEffect, useState } from "react";
import Weeklytrivia from "./components/pages/competitions/weeklytrivia/Weeklytrivia";
import ScrollToTop from "./ScrollToTop";
import Editprofile from "./components/pages/editprofile/EditProfile";

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
      <ScrollToTop>
        <div className="application">
          <div className="nav">
            <Navbar />
          </div>

          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/profil" element={<Profilepage />} />
              <Route path="/profil/:username" element={<Profilepage />} />
              <Route path="/editprofil" element={<Editprofile />} />
              <Route path="/highlights" element={<FeedPosts />} />
              <Route path="/signup" element={<CreateUser />} />
              <Route path="/following" element={<CreateUser />} />
              <Route path="/weeklytrivia" element={<Weeklytrivia />} />
              <Route path="/" element={<MainStandPage />} />
              {/* <Route path="/*" element={<Navigate replace to="/" />} /> */}
            </Routes>
            <Footer />
          </div>
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
