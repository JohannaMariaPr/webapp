import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/map">Map</NavLink>
          <NavLink to="/hikes">All Hikes</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}