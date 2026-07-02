import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ui";
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/pages/About", label: "About" },
  { to: "/pages/Dashboard", label: "Dashboard" },
  { to: "/pages/Reviews", label: "Reviews" },
  { to: "/pages/Demo", label: "Demo" },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur dark:border-line-dark dark:bg-paper-dark/95">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-forest text-[10px] font-label font-bold text-forest dark:border-forest-dark dark:text-forest-dark">
            RS
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            ReviewSense <span className="text-forest dark:text-forest-dark">AI</span>
          </span>
        </Link>

        <ul className="flex flex-wrap justify-center gap-1 font-label text-xs uppercase tracking-wide">
          {LINKS.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`block rounded-md px-3 py-2 transition ${
                    active
                      ? "bg-forest text-card dark:bg-forest-dark dark:text-ink-dark"
                      : "text-ink-soft hover:bg-forest/10 hover:text-forest dark:text-ink-soft-dark dark:hover:bg-forest-dark/10 dark:hover:text-forest-dark"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/pages/Login">
            <button className="rounded-md bg-forest px-4 py-2 font-label text-xs font-semibold uppercase tracking-wide text-card transition hover:bg-forest-deep dark:bg-forest-dark dark:text-ink-dark dark:hover:brightness-110">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
