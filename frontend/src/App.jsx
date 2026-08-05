import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toast } from "./components/ui";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <div className=" min-h-screen bg-paper dark:bg-paper-dark">
      {/* Single global toast container — pages just call showSuccessToast etc. */}
      <Toast />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages/About" element={<About />} />
          <Route path="/pages/Login" element={<Login />} />
          <Route path="/pages/Register" element={<Register />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {/* Protected — redirect unauthenticated visitors to /pages/Login */}
          <Route
            path="/pages/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages/Reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
