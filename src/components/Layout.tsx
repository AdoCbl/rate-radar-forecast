
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
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-blue-50 border-r border-blue-100 shadow-sm">
          <div className="flex items-center justify-center h-16 px-4 border-b border-blue-100 bg-white">
            <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-100 to-accent-light text-primary font-medium transform scale-105'
                    : 'text-gray-700 hover:bg-blue-50 hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-primary' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-blue-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-blue-100 z-20">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-blue-50 transition-colors"
            onClick={toggleMobileMenu}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-10 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-blue-50">
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-100">
            <h1 className="text-xl font-bold gradient-heading">Fed Forecaster</h1>
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-blue-50 transition-colors"
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
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-100 to-accent-light text-primary font-medium transform scale-105'
                    : 'text-gray-700 hover:bg-blue-50 hover:translate-x-1'
                }`}
                onClick={toggleMobileMenu}
              >
                <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-primary' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-blue-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold animate-pulse">
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
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 animate-fade-in">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
