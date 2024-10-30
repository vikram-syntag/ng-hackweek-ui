"use client";

import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Trash2, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { calculateMissionDuration, generateRandomColor } from "@/lib/mission-utils";
import { GeoJSONData } from "@/lib/types";

interface MissionControlSidebarProps {
  geoJSONFiles: { name: string; data: GeoJSONData; color: string }[];
  onFilesUpload: (files: { name: string; data: GeoJSONData; color: string }[]) => void;
  onFileDelete: (fileName: string) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
}

export function MissionControlSidebar({
  geoJSONFiles,
  onFilesUpload,
  onFileDelete,
  speed,
  onSpeedChange,
}: MissionControlSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const missionDuration = calculateMissionDuration(geoJSONFiles, speed);

  const handleFilesUploaded = (files: { name: string; data: GeoJSONData }[]) => {
    const filesWithColor = files.map(file => ({
      ...file,
      color: generateRandomColor(),
    }));
    onFilesUpload(filesWithColor);
  };

  return (
    <div className="h-screen p-4 bg-background border-r">
      <h2 className="text-lg font-semibold mb-4">Mission Control</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">UAV Count</h3>
          <Badge variant="secondary">{geoJSONFiles.length} UAVs</Badge>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Speed Control</h3>
          <div className="space-y-2">
            <Slider
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              min={1}
              max={30}
              step={1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{speed} m/s</span>
              <span>Est. Duration: {missionDuration}</span>
            </div>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              GeoJSON Files
              <ChevronDown className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-4">
              <FileUploader onFilesUploaded={handleFilesUploaded} />
              <ScrollArea className="h-[200px] mt-4">
                <div className="space-y-2">
                  {geoJSONFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-2 rounded-md bg-muted"
                    >
                      <div className="flex items-center flex-1">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: file.color }}
                        />
                        <span className="text-sm truncate mr-2">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onFileDelete(file.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}