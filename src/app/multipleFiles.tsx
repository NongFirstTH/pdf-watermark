"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, FileText, Loader2 } from "lucide-react";
import { degrees } from "pdf-lib";

const MultipleFiles = () => {
  const [file, setFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [templatePdfFile, setTemplatePdfFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  type ExcelRow = {
    id: string | number;
    fname: string;
    lname: string;
    [key: string]: any;
  };
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [sheetName, setSheetName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  // Effect to clean up object URLs when processedPdfUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (processedPdfUrl) {
        URL.revokeObjectURL(processedPdfUrl);
      }
    };
  }, [processedPdfUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const selectedFile = files && files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setProcessedPdfUrl(null); // Clear previous processed PDF URL
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleExcelFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const selectedFile = files && files[0];
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setExcelFile(selectedFile);
      setExcelData([]); // Clear previous data
      setProcessedPdfUrl(null); // Clear previous processed PDF URL
      await readExcelFile(selectedFile);
    } else {
      alert("Please select a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleTemplatePdfSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const selectedFile = files && files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setTemplatePdfFile(selectedFile);
      setProcessedPdfUrl(null); // Clear previous processed PDF URL
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const readExcelFile = async (file: File) => {
    try {
      const { read, utils } = await import("xlsx");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = utils.sheet_to_json(worksheet) as ExcelRow[];

      setSheetName(firstSheetName);

      // Validate required columns
      if (jsonData.length > 0) {
        const firstRow = jsonData[0] as Record<string, unknown>;
        const hasRequiredColumns =
          "id" in firstRow && "fname" in firstRow && "lname" in firstRow;
        if (!hasRequiredColumns) {
          alert("Excel file must contain columns: id, fname, lname");
          setExcelData([]);
          return;
        }
      }
      setExcelData(jsonData);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert(
        "Error reading Excel file. Please ensure it is a valid .xlsx or .xls file and try again."
      );
      setExcelData([]);
    }
  };

  const processMultiplePdfs = async () => {
    if (!excelFile || !templatePdfFile || excelData.length === 0) {
      alert(
        "Please select both Excel file and PDF template, and ensure Excel data is loaded."
      );
      return;
    }

    setIsProcessing(true);
    setProcessedPdfUrl(null); // Clear previous URL before processing

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const JSZip = (await import("jszip")).default;

      const zip = new JSZip();
      const templateArrayBuffer = await templatePdfFile.arrayBuffer();

      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        const { id, fname, lname } = row;

        if (!id || !fname || !lname) {
          console.warn(
            `Skipping row ${i + 1}: missing required data (id, fname, or lname)`
          );
          continue;
        }

        const watermarkTextForRow = `${id} ${fname} ${lname}`;

        const pdfDoc = await PDFDocument.load(templateArrayBuffer);

        // Register fontkit before embedding custom fonts
        const fontkit = (await import("@pdf-lib/fontkit")).default;
        pdfDoc.registerFontkit(fontkit);

        // Get pages and font
        const pages = pdfDoc.getPages();
        // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const containsThai = /[\u0E00-\u0E7F]/.test(watermarkTextForRow);

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

        const fontSize = 42;
        const textColor = rgb(0.7, 0.7, 0.7);
        const opacity = 0.3;

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(
            watermarkTextForRow,
            fontSize
          );
          const textHeight = font.heightAtSize(fontSize);
          const centerX = width / 2;
          const centerY = height / 2;

          page.drawText(watermarkTextForRow, {
            x: centerX - textWidth / 3,
            y: centerY - textHeight * 2,
            size: fontSize,
            font: font,
            color: textColor,
            opacity: opacity,
            rotate: degrees(40),
          });
        });

        const pdfBytes = await pdfDoc.save();
        const filename = `${sheetName}-${id} ${fname} ${lname}.pdf`;
        zip.file(filename, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      setProcessedPdfUrl(zipUrl);
    } catch (error) {
      console.error("Error processing Multiple PDFs:", error);
      alert("Error processing files. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWatermarkedPdf = () => {
    if (processedPdfUrl) {
      const link = document.createElement("a");
      link.href = processedPdfUrl;
      link.download = `${sheetName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setFile(null);
    setExcelFile(null);
    setTemplatePdfFile(null);
    setProcessedPdfUrl(null);
    setWatermarkText("");
    setExcelData([]);
    setSheetName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
    if (templateInputRef.current) {
      templateInputRef.current.value = "";
    }
  };

  return (
    <div className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-8">
      <div className="max-w-4xl mx-auto mb-16">
        <div className="text-center">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-700/50 to-purple-200/50 backdrop-blur-sm  rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-xl text-white mb-4">
              📋 วิธีใช้งาน
            </h3>
            <ul className="text-white/90 text-lg space-y-2 text-left max-w-2xl mx-auto">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>อัปโหลดไฟล์ Excel ที่มีคอลัมน์ id, fname, lname</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span>แต่ละแถวสร้างลายน้ำ: "id fname lname"</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>ดาวน์โหลดไฟล์ ZIP ที่มี PDF ทั้งหมด</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>ไฟล์จะถูกตั้งชื่อ: `sheetname-id fname lname.pdf`</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {/* Excel File Upload */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-green-400 hover:bg-white/15 transition-all duration-300 group">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelFileSelect}
              ref={excelInputRef}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <Upload className="w-12 h-12 text-green-400" />
              <div>
                <p
                  className={`text-lg font-medium transition-colors duration-300 ${
                    excelFile ? "text-green-400 text-xl" : "text-white"
                  }`}
                >
                  {excelFile ? excelFile.name : "Choose Excel file"}
                </p>
                <p className="text-sm text-white/70">
                  Excel file with columns: id, fname, lname
                </p>
              </div>
            </label>
          </div>

          {/* Template PDF Upload */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
            <input
              type="file"
              accept=".pdf"
              onChange={handleTemplatePdfSelect}
              ref={templateInputRef}
              className="hidden"
              id="template-upload"
            />
            <label
              htmlFor="template-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <Upload className="w-12 h-12 text-purple-400" />
              <div>
                <p
                  className={`text-lg font-medium transition-colors duration-300 ${
                    templatePdfFile ? "text-purple-400 text-xl" : "text-white"
                  }`}
                >
                  {templatePdfFile
                    ? templatePdfFile.name
                    : "Choose PDF template"}
                </p>
                <p className="text-sm text-white/70">
                  PDF template for watermarking
                </p>
              </div>
            </label>
          </div>

          {/* Excel Data Preview */}
          {excelData.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">
                Excel Data Preview
              </h4>
              <p className="text-sm text-green-600 mb-2">
                Sheet: {sheetName} | Records: {excelData.length} rows
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-green-100 text-green-800 text-center">
                      <th className="px-2 py-1 ">ID</th>
                      <th className="px-2 py-1 ">First Name</th>
                      <th className="px-2 py-1 ">Last Name</th>
                      <th className="px-2 py-1 ">Watermark Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 3).map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-green-200 text-gray-600"
                      >
                        <td className="px-2 py-1">{row.id}</td>
                        <td className="px-2 py-1">{row.fname}</td>
                        <td className="px-2 py-1">{row.lname}</td>
                        <td className="px-2 py-1 font-mono ">
                          {row.id} {row.fname} {row.lname}
                        </td>
                      </tr>
                    ))}
                    {excelData.length > 3 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-2 py-1 text-center text-gray-500"
                        >
                          ... and {excelData.length - 3} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={processMultiplePdfs}
              disabled={
                isProcessing ||
                !excelFile ||
                !templatePdfFile ||
                excelData.length === 0
              }
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
                  <span>Process Multiple</span>
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
                    <h3 className="text-base sm:text-lg font-medium text-green-300">
                      Multiple Processing Complete!
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3">
                  <button
                    onClick={downloadWatermarkedPdf}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ZIP</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {/* {processedPdfUrl && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
              <h3 className="text-lg font-medium text-gray-700">Preview</h3>
            </div>
            <div className="p-4">
              <iframe
                src={processedPdfUrl}
                width="100%"
                height="600px"
                className="border-0 rounded"
                title="PDF Preview"
              />
            </div>
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default MultipleFiles;
