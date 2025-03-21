"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/modal-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileSpreadsheet, Upload, X, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  youtubeEmbedId?: string;
  templateLink?: string;
  instructionSteps?: string[];
  onUploadSuccess?: (file: File) => void;
  entityName?: string; // e.g., "Student", "Course", "Organizer", etc.
}

const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  isOpen,
  onClose,
  title = "Upload Data",
  youtubeEmbedId = "dQw4w9WgXcQ", // Default video
  templateLink = "#",
  instructionSteps = [
    "Download the template file for correct formatting",
    "Fill in details in the template",
    "Save the file as .xlsx or .xls format",
    "Upload the file using the dropzone below",
  ],
  onUploadSuccess,
  // Removed unused entityName parameter
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cleanupRef = useRef(false);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen && !cleanupRef.current) {
      cleanupRef.current = true;
      // Use RAF to ensure smooth UI
      requestAnimationFrame(() => {
        setFile(null);
        setIsUploading(false);
        cleanupRef.current = false;
      });
    }
  }, [isOpen]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];

        // Check if file is an Excel file
        if (
          selectedFile.type === "application/vnd.ms-excel" ||
          selectedFile.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          setFile(selectedFile);
        } else {
          toast({
            title: "Invalid File Type",
            description: "Please upload an Excel file (.xls or .xlsx)",
            variant: "destructive",
          });
        }
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const handleRemoveFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload an Excel file to continue",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(file);
      }

      // Success toast
      toast({
        title: "File Uploaded Successfully",
        description: `Your Excel file has been uploaded and is being processed.`,
        variant: "default",
      });

      // Reset and close
      setFile(null);
      onClose();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
      alert(error);
    } finally {
      setIsUploading(false);
    }
  }, [file, toast, onClose, onUploadSuccess]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // Use RAF to ensure smooth UI
        requestAnimationFrame(() => {
          onClose();
        });
      }
    },
    [onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* YouTube Tutorial - Only render when visible */}
          {isOpen && youtubeEmbedId && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${youtubeEmbedId}`}
                title="Excel Upload Tutorial"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video"
              ></iframe>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">
                  Instructions for Excel Upload:
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  {instructionSteps.map((step, index) => (
                    <li key={index}>
                      {index === 0 && templateLink ? (
                        <>
                          Download the{" "}
                          <Link
                            href={templateLink}
                            className="text-blue-600 dark:text-blue-400 underline"
                          >
                            template file
                          </Link>{" "}
                          for correct formatting
                        </>
                      ) : (
                        step
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Dropzone */}
          <div className="mt-4">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileSpreadsheet className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                      {isDragActive
                        ? `Drop the Excel file here`
                        : `Drag & drop an Excel file here, or click to browse`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Supports .xlsx and .xls files up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[300px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 rounded-full text-black duration-150 transition-all dark:text-white dark:hover:text-blue-800 hover:bg-gray-200 dark:hover:bg-blue-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2">
                  <Upload className="h-4 w-4" />
                </span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadExcelModal;
