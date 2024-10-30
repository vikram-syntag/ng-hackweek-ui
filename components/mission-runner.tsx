"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { MissionControlSidebar } from "./mission-control-sidebar";
import { MissionMap } from "./mission-map";
import { GeoJSONData } from "@/lib/types";
import { generateRandomColor } from "@/lib/mission-utils";
import { toast } from "sonner";

export function MissionRunner() {
  const [geoJSONFiles, setGeoJSONFiles] = useState<{ name: string; data: GeoJSONData; color: string }[]>([]);
  const [speed, setSpeed] = useState(15);

  const handleFilesUpload = (files: { name: string; data: GeoJSONData }[]) => {
    const newFiles = files.map(file => {
      // Check for duplicate file names
      let fileName = file.name;
      let counter = 1;
      while (geoJSONFiles.some(existing => existing.name === fileName)) {
        const nameParts = file.name.split('.');
        const ext = nameParts.pop();
        const baseName = nameParts.join('.');
        fileName = `${baseName}_${counter}.${ext}`;
        counter++;
      }

      return {
        ...file,
        name: fileName,
        color: generateRandomColor(),
      };
    });

    setGeoJSONFiles(prev => [...prev, ...newFiles]);
    toast.success(`Successfully added ${newFiles.length} UAV${newFiles.length > 1 ? 's' : ''}`);
  };

  const handleFileDelete = (fileName: string) => {
    setGeoJSONFiles(prev => {
      const newFiles = prev.filter(file => file.name !== fileName);
      toast.success(`Removed UAV: ${fileName}`);
      return newFiles;
    });
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20}>
        <MissionControlSidebar
          geoJSONFiles={geoJSONFiles}
          onFilesUpload={handleFilesUpload}
          onFileDelete={handleFileDelete}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <MissionMap geoJSONFiles={geoJSONFiles} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}