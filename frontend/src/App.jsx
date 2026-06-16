import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Card";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

function App() {
  return (
    <div>
      <Navbar />
      <main className="px-4 py-8 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages/Dashboard" element={<Dashboard />} />
          <Route path="/pages/About" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;