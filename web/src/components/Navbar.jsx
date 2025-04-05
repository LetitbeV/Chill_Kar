import React, { useState } from "react";
import {
  ChevronDown,
  Menu,
  Gift,
  Bell,
  ShoppingBag,
  Monitor,
  CreditCard,
  HelpCircle,
  Settings,
  Award,
  X,
} from "lucide-react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleConnectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        window.alert("Connect to Metamask");
        window.location = "https://metamask.io/";
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        alert("You are not connected to the Sepolia Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  return (
    <header className="w-full shadow-md bg-white">
      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and search */}
          <div className="flex items-center justify-between gap-4 flex-1 h-15 max-w-8/12">
            {/* Logo */}
            <NavLink to="/">
              <div className="flex items-center">
                <div className="text-xl font-bold">
                  <span className="text-yellow-600 bg-yellow-100 px-1 mx-1 rounded text-3xl">
                    Chill
                  </span>
                  <span className="text-gray-800 text-3xl">Kar</span>
                </div>
              </div>
            </NavLink>

            <SearchBar />
            {/* Search Bar */}
            {/* <div className="hidden md:flex items-center flex-1 max-w-2xl relative">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="mr-10 pl-10 pr-4 py-2 rounded w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div> */}
          </div>

          {/* Location and Sign In */}
          <div className="flex items-center gap-4">
            {/* Location */}
            {/* <div className="hidden md:flex items-center cursor-pointer">
              <span>{location}</span>
              <ChevronDown size={16} />
            </div> */}

            {/* Sign In Button */}
            <button
              onClick={handleConnectWallet}
              className="bg-yellow-500 cursor-pointer text-white rounded py-1 px-4 hover:bg-yellow-600 transition-colors"
            >
              {currentAccount.substring(0,6)+"..." || "Connect Wallet"}
            </button>
            {/* Sign In Button */}

            {/* Hamburger Menu */}
            <button
              className="p-1 focus:outline-none cursor-pointer"
              onClick={toggleSidebar}
            >
              <Menu className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <nav className="flex justify-between py-3 border-t border-gray-100">
          <ul className="flex gap-6">
            <li className="font-medium">
              <NavLink
                to="/Movies"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline underline-offset-3"
                      : ""
                  }`
                }
              >
                Movies
              </NavLink>
            </li>
            <li className="font-medium">
              <NavLink
                to="/Sports"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline underline-offset-3"
                      : ""
                  }`
                }
              >
                Sports
              </NavLink>
            </li>
            <li className="font-medium">
              <NavLink
                to="/Concerts"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline underline-offset-3"
                      : ""
                  }`
                }
              >
                Concerts
              </NavLink>
            </li>
            <li className="font-medium">
              <NavLink
                to="/Events"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline  underline-offset-3"
                      : ""
                  }`
                }
              >
                Other Events
              </NavLink>
            </li>
          </ul>

          <ul className="hidden md:flex gap-6">
            <li className="font-medium text-gray-800 hover:text-yellow-500 cursor-pointer">
              <NavLink
                to="/events-analytics"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline underline-offset-3"
                      : ""
                  }`
                }
              >
                Events Analytics
              </NavLink>
            </li>
            <li className="font-medium text-gray-800 hover:text-yellow-500 cursor-pointer">
              <NavLink
                to="/PostEvent"
                className={({ isActive }) =>
                  `text-gray-800 hover:text-yellow-500 cursor-pointer ${
                    isActive
                      ? "text-yellow-500 underline underline-offset-3"
                      : ""
                  }`
                }
              >
                ListYourShow
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-800">Hey!</h2>
            <button
              className="p-1 focus:outline-none cursor-pointer"
              onClick={toggleSidebar}
            >
              <X className="text-gray-700" size={22} />
            </button>
          </div>
        </div>

        {/* Login prompt section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-full p-2">
              <Gift className="text-yellow-500" size={18} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Unlock special offers &</p>
              <p className="text-gray-500 text-sm">great benefits</p>
            </div>
          </div>
          <button className="border border-yellow-500 text-yellow-500 rounded px-3 py-1 text-sm hover:bg-yellow-50 transition-colors">
            Login / Register
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-grow">
          {/* Menu items */}
          <SidebarMenuItem
            icon={<Bell size={18} className="text-gray-500" />}
            title="Notifications"
            showChevron={true}
          />

          <SidebarMenuItem
            icon={<ShoppingBag size={18} className="text-gray-500" />}
            title="Your Orders"
            subtitle="View all your bookings & purchases"
            showLock={true}
          />

          <SidebarMenuItem
            icon={<Monitor size={18} className="text-gray-500" />}
            title="Stream Library"
            subtitle="Rented & Purchased Movies"
            showLock={true}
          />

          <SidebarMenuItem
            customIcon={
              <div className="border border-gray-300 rounded p-1 flex items-center justify-center">
                <span className="text-xs bg-gray-200 px-1 rounded">NEW</span>
              </div>
            }
            title="Play Credit Card"
            subtitle="View your Play Credit Card details and offers"
            showChevron={true}
          />

          <SidebarMenuItem
            icon={<HelpCircle size={18} className="text-gray-500" />}
            title="Help & Support"
            subtitle="View commonly asked queries and Chat"
            showChevron={true}
          />

          <SidebarMenuItem
            icon={<Settings size={18} className="text-gray-500" />}
            title="Accounts & Settings"
            subtitle="Location, Payments, Permissions & More"
            showLock={true}
          />

          <SidebarMenuItem
            icon={<Award size={18} className="text-gray-500" />}
            title="Rewards"
            subtitle="View your rewards & unlock new ones"
            showChevron={true}
            isLast={true}
          />
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </header>
  );
};

// Helper component for sidebar menu items for better consistency and maintenance
const SidebarMenuItem = ({
  icon,
  customIcon,
  title,
  subtitle,
  showChevron,
  showLock,
  isLast = false,
}) => {
  return (
    <div className={`border-b border-gray-200 ${isLast ? "pb-4" : ""}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {icon || customIcon}
          <div>
            <p className="text-gray-800 font-medium text-base">{title}</p>
            {subtitle && (
              <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {showChevron && <ChevronDown size={18} className="text-gray-500" />}
        {showLock && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default Navbar;
