import { useState } from "react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
              The สมอง
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                Home
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                About
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                Services
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-yellow-300 p-2 rounded-md transition-colors duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-300 hover:bg-white/10 transition-all duration-300"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-300 hover:bg-white/10 transition-all duration-300"
            >
              About
            </a>
            <a
              href="#"
              className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-300 hover:bg-white/10 transition-all duration-300"
            >
              Services
            </a>
            <a
              href="#"
              className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-300 hover:bg-white/10 transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
// <header className="w-full px-0 py-4 bg-linear-to-r/srgb from-indigo-500 to-teal-400 shadow-lg drop-shadow z-50">
//   <nav className="max-w-4xl mx-auto flex justify-between items-center">
//     <span className="font-bold text-2xl tracking-wider drop-shadow-lg bg-white/20 rounded px-3 py-1 shadow text-white">
//       เดอะ <span className="text-[#FF9696]">สมอง</span>
//     </span>
//     <div className="flex gap-4">
//       {/* <Link href="/">Home</Link>
//       <Link href="/about">About</Link>
//       <Link href="/contact">Contact</Link> */}
//     </div>
//   </nav>
// </header>
