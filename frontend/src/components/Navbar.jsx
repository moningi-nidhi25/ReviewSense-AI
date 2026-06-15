function Navbar() {
  return (
    <nav className=" flex items-center justify-between px-8 py-4 shadow-md">
      <h1 className="text-2xl font-bold text-green-600">
        ReviewSense AI
      </h1>

      <ul className="flex gap-6 font-medium">
        <li>Home</li>
        <li>Dashboard</li>
        <li>About</li>
      </ul>

      <button className="bg-green-500 hover:bg-green-600 text-white text-white px-4 py-2 rounded-lg">
        Login
      </button>
    </nav>
  );
}

export default Navbar;
