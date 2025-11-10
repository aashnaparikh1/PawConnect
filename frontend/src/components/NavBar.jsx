import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, getUser, logout } from "../utils/auth";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-white font-bold text-2xl">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <span className="text-3xl">🐾</span>
              <span>PawConnect</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-primary-100 transition font-medium">
                  Dashboard
                </Link>
                <Link to="/pets" className="text-white hover:text-primary-100 transition font-medium">
                  Browse Pets
                </Link>
                <Link to="/my-pets" className="text-white hover:text-primary-100 transition font-medium">
                  My Pets
                </Link>
                <Link to="/resources" className="text-white hover:text-primary-100 transition font-medium">
                  Resources
                </Link>
                <Link to="/events" className="text-white hover:text-primary-100 transition font-medium">
                  Events
                </Link>
                <Link to="/reminders" className="text-white hover:text-primary-100 transition font-medium">
                  Reminders
                </Link>
                <Link to="/favorites" className="text-white hover:text-primary-100 transition font-medium">
                  Favorites
                </Link>
                {(user.role === 'admin' || user.role === 'shelter') && (
                  <Link to="/admin" className="text-white hover:text-primary-100 transition font-medium">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white border-opacity-30">
                  <span className="text-white text-sm">Hi, {user.firstName}!</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-white text-primary-600 px-4 py-2 rounded-full hover:bg-primary-50 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/pets" className="text-white hover:text-primary-100 transition font-medium">
                  Browse Pets
                </Link>
                <Link to="/resources" className="text-white hover:text-primary-100 transition font-medium">
                  Resources
                </Link>
                <Link to="/events" className="text-white hover:text-primary-100 transition font-medium">
                  Events
                </Link>
                <Link to="/aboutTeam" className="text-white hover:text-primary-100 transition font-medium">
                  About
                </Link>
                <Link to="/login">
                  <button className="bg-accent-500 text-white px-4 py-2 rounded-full hover:bg-accent-600 transition font-medium">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-white text-primary-600 px-4 py-2 rounded-full hover:bg-primary-50 transition font-medium">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="lg:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-white hover:text-primary-100 transition">
                  Dashboard
                </Link>
                <Link to="/pets" className="block text-white hover:text-primary-100 transition">
                  Browse Pets
                </Link>
                <Link to="/my-pets" className="block text-white hover:text-primary-100 transition">
                  My Pets
                </Link>
                <Link to="/resources" className="block text-white hover:text-primary-100 transition">
                  Resources
                </Link>
                <Link to="/events" className="block text-white hover:text-primary-100 transition">
                  Events
                </Link>
                <Link to="/reminders" className="block text-white hover:text-primary-100 transition">
                  Reminders
                </Link>
                <Link to="/favorites" className="block text-white hover:text-primary-100 transition">
                  Favorites
                </Link>
                {(user.role === 'admin' || user.role === 'shelter') && (
                  <Link to="/admin" className="block text-white hover:text-primary-100 transition">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left text-white hover:text-primary-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/pets" className="block text-white hover:text-primary-100 transition">
                  Browse Pets
                </Link>
                <Link to="/resources" className="block text-white hover:text-primary-100 transition">
                  Resources
                </Link>
                <Link to="/events" className="block text-white hover:text-primary-100 transition">
                  Events
                </Link>
                <Link to="/aboutTeam" className="block text-white hover:text-primary-100 transition">
                  About
                </Link>
                <Link to="/login" className="block text-white hover:text-primary-100 transition">
                  Login
                </Link>
                <Link to="/register" className="block text-white hover:text-primary-100 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
