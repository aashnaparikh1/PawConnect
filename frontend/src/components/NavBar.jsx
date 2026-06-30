import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser, logout } from "../utils/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const user = getUser();
  const isAdmin = user && (user.role === "admin" || user.role === "shelter");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex gap-8 justify-between px-9 py-6 items-center">
      <div className="font-bold text-2xl">
        <Link to="/">PawConnect</Link>
      </div>
      <div className="flex justify-end gap-6 items-center text-sm">
        <Link to="/aboutTeam">About</Link>
        <Link to="/breeds">Breeds</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/resources">Care</Link>
        <Link to="/events">Community</Link>

        {authed ? (
          <>
            <Link to="/my-pets">My Pets</Link>
            <Link to="/reminders">Reminders</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/dashboard">Dashboard</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <Link to="/pets">
              <button className="border p-3 rounded-xl bg-blue-400 text-white">Adopt</button>
            </Link>
            <button
              onClick={handleLogout}
              className="border p-3 rounded-xl bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/pets">
              <button className="border p-3 rounded-xl bg-blue-400 text-white">Adopt</button>
            </Link>
            <Link to="/login">
              <button className="border p-3 rounded-xl bg-gray-200">Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
