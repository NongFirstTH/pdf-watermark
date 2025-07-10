"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, FileText, Loader2 } from "lucide-react";
import { degrees } from "pdf-lib";

const SingleFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState(
    "680610000 ตัวอย่าง นะครับ"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setProcessedPdfUrl(null);
      } else {
        alert("Please select a valid PDF file");
      }
    } else {
      alert("No file selected");
    }
  };

  const addWatermarkToPdf = async () => {
    if (!file || !watermarkText.trim()) {
      alert("Please select a PDF file and enter watermark text");
      return;
    }

    setIsProcessing(true);

    try {
      // Import PDF-lib dynamically for client-side usage
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

      // Read the uploaded PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Register fontkit before embedding custom fonts
      const fontkit = (await import("@pdf-lib/fontkit")).default;
      pdfDoc.registerFontkit(fontkit);

      // Get pages and font
      const pages = pdfDoc.getPages();
      // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Check if text contains Thai characters
      const containsThai = /[\u0E00-\u0E7F]/.test(watermarkText);
      if (containsThai) {
        try {
          // Try to load a Thai font
          const fontUrl = "/assets/fonts/NotoSansThai-Regular.ttf";

          // Fetch the font file as an ArrayBuffer
          const fontBytesResponse = await fetch(fontUrl);
          if (!fontBytesResponse.ok) {
            throw new Error(
              `Failed to fetch font from ${fontUrl}: ${fontBytesResponse.statusText}`
            );
          }
          const fontBytes = await fontBytesResponse.arrayBuffer();

          font = await pdfDoc.embedFont(fontBytes);
        } catch (error) {
          console.warn("Thai font loading failed, converting text:", error);
        }
      }

      // Watermark settings
      const fontSize = 42;
      const textColor = rgb(0.7, 0.7, 0.7);
      const opacity = 0.3;

      // Add watermark to each page
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Center position
        const centerX = width / 2;
        const centerY = height / 2;

        // Add single watermark at center with 45-degree rotation
        page.drawText(watermarkText, {
          x: centerX - textWidth / 3,
          y: centerY - textHeight * 2.5,
          size: fontSize,
          font: font,
          color: textColor,
          opacity: opacity,
          rotate: degrees(40),
        });
      });

      // Save the PDF with watermark
      const pdfBytes = await pdfDoc.save();
      const safePdfBytes = new Uint8Array(pdfBytes);
      const blob = new Blob([safePdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setProcessedPdfUrl(url);
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Error processing PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWatermarkedPdf = (text: string) => {
    if (processedPdfUrl && file) {
      const link = document.createElement("a");
      link.href = processedPdfUrl;
      link.download = `${text}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setFile(null);
    setProcessedPdfUrl(null);
    setWatermarkText(watermarkText);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-8">
      {/* PDF Watermark Tool Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-8">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-700/50 to-purple-200/50 backdrop-blur-sm  rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-xl text-white mb-4">
              📋 วิธีใช้งาน
            </h3>
            <ul className="text-white/90 text-lg space-y-2 text-left max-w-2xl mx-auto">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>เลือกไฟล์ PDF จากอุปกรณ์ของคุณ</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span>กรอกข้อความลายน้ำที่ต้องการ (ไทย/อังกฤษ)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>คลิก "Add Watermark" เพื่อประมวลผล PDF</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>ดาวน์โหลด PDF ที่มีลายน้ำแล้ว</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-white/90 text-lg mb-6">
          Add beautiful watermarks to your PDF documents
        </p>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-yellow-400 hover:bg-white/15 transition-all duration-300 group">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <Upload className="w-12 h-12 text-white/70 group-hover:text-yellow-400 transition-colors duration-300" />
              <div>
                <p
                  className={`text-lg font-medium transition-colors duration-300 ${
                    file ? "text-yellow-400 text-xl" : "text-white"
                  }`}
                >
                  {file && file.name ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-white/70">
                  Click to browse or drag and drop
                </p>
              </div>
            </label>
          </div>

          {/* Watermark Text Input */}
          <div>
            <label
              htmlFor="watermark-text"
              className="block text-m font-medium text-white mb-2"
            >
              Watermark Text
            </label>
            <input
              type="text"
              id="watermark-text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-white/60 transition-all duration-300"
              style={{ fontFamily: 'Arial, "Noto Sans Thai", sans-serif' }}
            />
          </div>

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={addWatermarkToPdf}
              disabled={!file || !watermarkText.trim() || isProcessing}
              className="cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Add Watermark</span>
                </>
              )}
            </button>
          </div>

          {/* Download Section */}
          {processedPdfUrl && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-white">
                      ✨ Watermark Added Successfully!
                    </h3>
                    <p className="text-sm text-green-300">
                      Your PDF is ready for download
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3">
                  <button
                    onClick={() => downloadWatermarkedPdf(watermarkText)}
                    className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500/50 to-gray-600/50 backdrop-blur-sm hover:from-gray-600/60 hover:to-gray-700/60 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {processedPdfUrl && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-6 py-3 border-b border-white/20">
                <h3 className="text-lg font-medium text-white">Preview</h3>
              </div>
              <div className="p-6">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <iframe
                    src={processedPdfUrl}
                    width="100%"
                    height="600px"
                    className="border-0 rounded"
                    title="PDF Preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleFile;
