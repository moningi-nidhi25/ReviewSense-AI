function Navbar() {
  return (
    <nav className=" flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 shadow-md gap-4">
      <h1 className="text-2xl font-bold text-green-600">
        ReviewSense AI
      </h1>

      <ul className="flex flex-wrap justify-center gap-6 font-medium">
        <li ><a href="/">Home</a></li>
        <li ><a href="/pages/About">About</a></li>
        <li ><a href="/pages/Dashboard">Dashboard</a></li>
      </ul>

      <button className="bg-green-500 hover:bg-green-600 text-white text-white px-4 py-2 rounded-lg">
        <a href="/pages/Login" className="text-white">
          Login
        </a>
      </button>
    </nav>
  );
}

export default Navbar;
