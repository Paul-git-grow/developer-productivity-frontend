import React, { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import Calendar from "./pages/calender";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";

import "./styles/global.css";
import "./styles/pages.css";
import "./styles/themes.css";
import "./styles/Signup.css";


function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "Light"
  );

  const [activePage, setActivePage] = useState("Dashboard");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
    } else if (theme === "Light") {
      document.body.classList.remove("dark-theme");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      document.body.classList.toggle(
        "dark-theme",
        prefersDark
      );
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setActivePage("Dashboard");
    setAuthPage("login");
  };

  const renderPage = () => {
    switch (activePage) {

      case "Projects":
          return <Projects />;

      case "Tasks":
        return <Tasks />;

      case "Profile":
        return <Profile />;


      case "Calendar":
        return <Calendar />;

      case "Analytics":
        return <Analytics />;

      case "Settings":
        return (
          <Settings
            theme={theme}
            setTheme={setTheme}
          />
        );


      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  // LOGIN / SIGNUP PAGE
  if (!isLoggedIn) {
    if (authPage === "signup") {
      return (
        <Signup
          onGoLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={() => {
          setIsLoggedIn(true);
        }}
        onGoSignup={() => {
          setAuthPage("signup");
        }}
      />
    );
  }

  // DASHBOARD
  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <div className="main-area">
        <Header />

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;