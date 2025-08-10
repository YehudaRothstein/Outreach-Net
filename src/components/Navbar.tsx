import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const categories = [
    { key: 'community_events', label: 'Community Events' },
    { key: 'stem_outreach', label: 'STEM Outreach' },
    { key: 'fundraising', label: 'Fundraising' },
    { key: 'mentorship', label: 'Mentorship' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Trophy className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
              <div className="absolute -inset-1 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-neutral-900">OutreachNet</span>
              <span className="text-xs text-neutral-500 -mt-1">FRC Community</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button 
                className="nav-link flex items-center space-x-1"
                onClick={toggleDropdown}
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 animate-fade-in">
                  {categories.map((category) => (
                    <Link
                      key={category.key}
                      to={`/?category=${category.key}`}
                      className="block px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <Link
                to="/create"
                className={`nav-link ${isActive('/create') ? 'nav-link-active' : ''}`}
              >
                New Thread
              </Link>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-neutral-800">{user.displayName}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">{user.displayName}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <div className="border-t border-neutral-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-secondary-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white animate-slide-in">
            <div className="py-4 space-y-2">
              <Link
                to="/"
                className={`mobile-nav-link ${isActive('/') ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1 ml-4">
                  {categories.map((category) => (
                    <Link
                      key={category.key}
                      to={`/?category=${category.key}`}
                      className="block py-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>

              {user && (
                <Link
                  to="/create"
                  className={`mobile-nav-link ${isActive('/create') ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  New Thread
                </Link>
              )}

              <div className="border-t border-neutral-200 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <div className="flex items-center space-x-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{user.displayName}</p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="mobile-nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="mobile-nav-link text-secondary-600"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="px-4 space-y-2">
                    <Link
                      to="/login"
                      className="btn btn-ghost w-full justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary w-full justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-link {
          @apply text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors relative py-2;
        }
        
        .nav-link-active {
          @apply text-primary-600;
        }
        
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--primary-600);
          border-radius: 1px;
        }
        
        .mobile-nav-link {
          @apply flex items-center px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors;
        }
        
        .mobile-nav-link-active {
          @apply text-primary-600 bg-primary-50;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;