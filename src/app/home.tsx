"use client";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { useState } from "react";
import SingleFile from "./singleFile";
import MultipleFiles from "./multipleFiles";

export default function Home() {
  const [processingMode, setProcessingMode] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <button
              className="cursor-pointer bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group"
              onClick={() => setProcessingMode("single")}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" />
                </svg>
              </div>
              <div className="grid justify-items-start">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Single File
                </h3>
                <p className="text-white/80">
                  This form allows single file upload.
                </p>
              </div>
            </button>

            <button
              className="cursor-pointer bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group"
              onClick={() => setProcessingMode("multiple")}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M400-400h160v-80H400v80Zm0-120h320v-80H400v80Zm0-120h320v-80H400v80Zm-80 400q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                </svg>
              </div>
              <div className="grid justify-items-start">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Multiple Files
                </h3>
                <p className="text-white/80">
                  This form supports multiple files upload.
                </p>
              </div>
            </button>
          </div>

          {/* Call to Action */}
          {processingMode === "single" && <SingleFile />}
          {processingMode === "multiple" && <MultipleFiles />}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
