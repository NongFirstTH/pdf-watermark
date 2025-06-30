const Footer = () => {
  return (
    <div>
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">
                The สมอง
              </h3>
              <p className="text-white/80 mb-4 max-w-md">
                The สมอง is a Facebook page dedicated to teaching materials and compro. With a passion for education and hands-on experience, we share practical techniques and helpful tips just for you.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 NongFirtsTH. All rights reserved.
            </p>
            <p className="text-white/60 text-sm mt-2 md:mt-0">
              Made with ❤️ and lots of passion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
// <footer className="w-full mt-10 p-6 bg-gradient-to-r from-teal-100 via-blue-100 to-teal-100 text-center text-blue-800 font-medium backdrop-blur-sm shadow-inner rounded-t-lg">
//   <span className="inline-flex items-center gap-2 justify-center">
//     &copy; {new Date().getFullYear()}{" "}
//     <a href="https://github.com/NongFirstTH" target="_blank" className="hover:text-blue-500 transition-all">NongFirstTH</a>.
//     <p>All rights reserved.</p>
//   </span>
// </footer>
