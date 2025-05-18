
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChartBar, ChartPie, Users, User, Menu, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: ChartBar },
  { name: 'Scenario Game', path: '/scenario', icon: ChartPie },
  { name: 'Leaderboard', path: '/leaderboard', icon: Users },
  { name: 'Profile', path: '/profile', icon: User },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-accent-light text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-primary font-semibold">
                U
              </div>
              <div>
                <p className="text-sm font-medium">User Demo</p>
                <p className="text-xs text-gray-500">Rank: Novice</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-accent-light text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={toggleMobileMenu}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-primary font-semibold">
                U
              </div>
              <div>
                <p className="text-sm font-medium">User Demo</p>
                <p className="text-xs text-gray-500">Rank: Novice</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
