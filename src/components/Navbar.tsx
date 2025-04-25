import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-[var(--frc-blue)]" />
              <span className="ml-2 text-xl font-bold text-[var(--frc-blue)]">OutreachNet</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-700 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <div className="relative group">
                <button 
                  className="border-transparent text-gray-700 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                  onClick={toggleDropdown}
                >
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <Link
                        to="/?category=community_events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Community Events
                      </Link>
                      <Link
                        to="/?category=stem_outreach"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        STEM Outreach
                      </Link>
                      <Link
                        to="/?category=fundraising"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Fundraising
                      </Link>
                      <Link
                        to="/?category=mentorship"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Mentorship
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {user && (
                <Link
                  to="/create"
                  className="border-transparent text-gray-700 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  New Thread
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex text-sm items-center rounded-full text-gray-700 hover:text-[var(--frc-blue)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--frc-blue)]"
                >
                  <span className="mr-2">{user.displayName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <Link
                      to="/profile"
                      className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="btn btn-secondary"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[var(--frc-blue)] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--frc-blue)]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/admin"
              className="bg-white border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] block pl-3 pr-4 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <button
              className="w-full text-left bg-white border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleDropdown}
            >
              Categories
              <ChevronDown className="inline-block ml-1 h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div className="bg-gray-50 border-l-4 border-transparent pl-6">
                <Link
                  to="/?category=community_events"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[var(--frc-blue)]"
                  onClick={() => {
                    setIsOpen(false);
                    setDropdownOpen(false);
                  }}
                >
                  Community Events
                </Link>
                <Link
                  to="/?category=stem_outreach"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[var(--frc-blue)]"
                  onClick={() => {
                    setIsOpen(false);
                    setDropdownOpen(false);
                  }}
                >
                  STEM Outreach
                </Link>
                <Link
                  to="/?category=fundraising"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[var(--frc-blue)]"
                  onClick={() => {
                    setIsOpen(false);
                    setDropdownOpen(false);
                  }}
                >
                  Fundraising
                </Link>
                <Link
                  to="/?category=mentorship"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[var(--frc-blue)]"
                  onClick={() => {
                    setIsOpen(false);
                    setDropdownOpen(false);
                  }}
                >
                  Mentorship
                </Link>
              </div>
            )}
            {user && (
              <Link
                to="/create"
                className="bg-white border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-[var(--frc-blue)] hover:text-[var(--frc-blue)] block pl-3 pr-4 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                New Thread
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.displayName}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;