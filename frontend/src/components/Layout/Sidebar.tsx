import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  MessageSquare,
  Tags,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Star,
} from 'lucide-react';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Questions',
    href: '/questions',
    icon: MessageSquare,
  },
  {
    name: 'Tags',
    href: '/tags',
    icon: Tags,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
];

const quickLinks = [
  {
    name: 'Hot Questions',
    href: '/questions?sort=votes',
    icon: TrendingUp,
  },
  {
    name: 'Featured',
    href: '/questions?featured=true',
    icon: Star,
  },
  {
    name: 'Help Center',
    href: '/help',
    icon: BookOpen,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 py-4">
        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                          active
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 shrink-0 transition-colors ${
                            active ? 'text-primary-700' : 'text-gray-400 group-hover:text-primary-700'
                          }`}
                        />
                        {item.name}
                        {active && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-primary-50 rounded-md -z-10"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            
            {/* Quick Links */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">
                Quick Links
              </div>
              <ul className="-mx-2 mt-2 space-y-1">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-700 hover:text-primary-700 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-primary-700" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Stats Card */}
            <li className="mt-auto">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Award size={20} />
                  <span className="font-semibold">Community Stats</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions</span>
                    <span>12.5k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answers</span>
                    <span>18.2k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users</span>
                    <span>3.1k</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;