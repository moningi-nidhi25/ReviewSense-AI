import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui";

function Navbar() {
  return (
    <nav className=" flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 shadow-md gap-4 dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
        ReviewSense AI
      </h1>
      <ul className="flex flex-wrap justify-center gap-6 font-medium dark:text-green-400">
        <li ><Link to="/">Home</Link></li>
        <li ><Link to="/pages/About">About</Link></li>
        <li ><Link to="/pages/Dashboard">Dashboard</Link></li>
        <li ><Link to="/pages/Reviews">Reviews</Link></li>
        <li ><Link to="/pages/Demo">Demo</Link></li>
      </ul>
      <ThemeToggle />
      <Link to="/pages/Login" className="text-white">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
          Login 
        </button>
      </Link>
    </nav>
  );
}

export default Navbar;
