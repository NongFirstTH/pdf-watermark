"use client";
import Navbar from "@/components/navbar";
import PdfWatermark from "./watermark";
import Footer from "@/components/footer";

export default function ColorfulWebsite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* <div className="absolute -top-10 -left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div> */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-l from-yellow-400 via-red-500/80 to-red-700 bg-clip-text text-transparent">
                PDF
              </span>
              Watermark Tool
            </h2>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-black/15 transition-all duration-300">
            <PdfWatermark />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
