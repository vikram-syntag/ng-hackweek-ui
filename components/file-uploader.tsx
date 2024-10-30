"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { GeoJSONData } from "@/lib/types";

interface FileUploaderProps {
  onFilesUploaded: (files: { name: string; data: GeoJSONData }[]) => void;
}

export function FileUploader({ onFilesUploaded }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filePromises = acceptedFiles.map((file) => {
        return new Promise<{ name: string; data: GeoJSONData }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onabort = () => reject(new Error("File reading was aborted"));
          reader.onerror = () => reject(new Error("File reading has failed"));
          reader.onload = () => {
            try {
              const data = JSON.parse(reader.result as string);
              // Validate that the data matches GeoJSONData structure
              if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
                throw new Error("Invalid GeoJSON format");
              }
              resolve({ name: file.name, data });
            } catch (error) {
              reject(new Error("Invalid GeoJSON file"));
            }
          };
          reader.readAsText(file);
        });
      });

      Promise.all(filePromises)
        .then((files) => {
          onFilesUploaded(files);
          toast.success(`Successfully uploaded ${files.length} file(s)`);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    },
    [onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json", ".geojson"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
    >
      <input {...getInputProps()} />
      <Button variant="ghost" className="w-full h-full">
        <Upload className="h-4 w-4 mr-2" />
        {isDragActive ? (
          <span>Drop the files here</span>
        ) : (
          <span>Upload GeoJSON files</span>
        )}
      </Button>
    </div>
  );
}