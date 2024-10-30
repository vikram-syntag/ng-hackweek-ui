"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { MissionMap } from "@/components/mission-map";
import { mockPreviousRuns } from "@/lib/mock-data";
import type { MissionRun } from "@/lib/types";

export default function PreviousRuns() {
  const [selectedRun, setSelectedRun] = useState<MissionRun | null>(null);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-screen p-4 bg-background border-r">
          <h2 className="text-lg font-semibold mb-4">Previous Missions</h2>
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <div className="space-y-4">
              {mockPreviousRuns.map((run) => (
                <Card
                  key={run.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                    selectedRun?.id === run.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {format(run.timestamp, "PPp")}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>UAVs: {run.uavCount}</div>
                      <div>Height: {run.height}m</div>
                      <div>Speed: {run.speed}m/s</div>
                      <div>Distance: {run.distance}km</div>
                      <div className="col-span-2">
                        Est. Time: {Math.floor(run.estimatedTime / 60)}m {run.estimatedTime % 60}s
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        {selectedRun ? (
          <MissionMap geoJSONFiles={selectedRun.geoJSON} />
        ) : (
          <div className="w-full h-screen bg-muted flex items-center justify-center text-muted-foreground">
            Select a mission to view details
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}