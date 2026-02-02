import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropProvider, PointerSensor, KeyboardSensor } from "@dnd-kit/react";
import {
  APP_MODE,
  type AppModeType,
  useAppContext,
  type BreakpointType,
} from "../../services/providers/AppContext";
import { useBuilderContext } from "../../services/providers/BuilderContext";
import { useTheme } from "../../services/providers/ThemeProvider";
import useFullscreen from "../../hooks/useFullscreen";
import useDnd from "../../hooks/useDnd";
import PanelButtons from "../../ManagerNode/PanelButtons";
import NodeSettings from "../../ManagerNode/components/NodeSettings";
import NodeWrapper from "../../ManagerNode/NodeWrapper";
import CustomDragOverlay from "../../components/DragOverlay";
import type {DragDropEvents} from '@dnd-kit/abstract';
import {DragDropManager} from '@dnd-kit/dom';
import type { Draggable, Droppable} from '@dnd-kit/dom';

type Events = DragDropEvents<Draggable, Droppable, DragDropManager>;
type DragStartHandler = Events['dragstart'];

import tailwindHelper from "../../utils/tailwindHelper";
import Layout from "../layout";
import { cn } from "@editeur/lib/utils";
import { Button } from "@editeur/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@editeur/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@editeur/components/ui/tooltip";
import { Separator } from "@editeur/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@editeur/components/ui/card";
import {
  Eye,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  PenSquare,
  Phone,
  RotateCcw,
  RotateCw,
  Sun,
  Tablet,
} from "lucide-react";

function Builder() {
  const { nodes, mode, setMode, breakpoint, setBreakpoint } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const {
    undo,
    redo,
    canRedo,
    canUndo,
    sidebarLeftCollapsed,
    setSidebarLeftCollapsed,
    save,
    isAutoSaveActive
  } = useBuilderContext();

  const { onDragEnd } = useDnd();
  const divRef = useRef<HTMLDivElement>(null);

  const { isFullScreen, enterFullScreen, exitFullScreen } = useFullscreen();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<{ action?: "add" | "move-node"; type?: string; id?: string } | null>(null);

  const handleDragStart: DragStartHandler = useCallback((event) => {

    const source = event.operation.source;
    if (source) {
      setActiveDragId(source.id as string);
      setActiveDragData((source.data as { action?: "add" | "move-node"; type?: string; id?: string }) || null);
    }
  }, []);

  const handleDragEnd = useCallback((event: Parameters<typeof onDragEnd>[0], manager: Parameters<typeof onDragEnd>[1]) => {
    if (mode !== APP_MODE.PREVIEW && onDragEnd) {
      onDragEnd(event, manager);
    }
    setActiveDragId(null);
    setActiveDragData(null);
  }, [mode, onDragEnd]);

  useEffect(() => {
    tailwindHelper.updateNodes(nodes);
    save();
  }, [nodes, save]);

  const handleModeChange = useCallback(
    (nextMode: string) => {
      if (!nextMode || nextMode === mode) {
        return;
      }
      setMode(nextMode as AppModeType);
    },
    [mode, setMode]
  );

  const handleBreakpointChange = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }
      setBreakpoint(value as BreakpointType);
    },
    [setBreakpoint]
  );

  const toggleFullscreen = useCallback(() => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  }, [enterFullScreen, exitFullScreen, isFullScreen]);

  return (
    <DragDropProvider
      sensors={[
        PointerSensor.configure({ activationConstraints: () => undefined }),
        KeyboardSensor,
      ]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CustomDragOverlay activeId={activeDragId} activeData={activeDragData} />
      <div 
        ref={divRef} 
        className={cn(
          "admin-layout relative h-screen flex flex-col overflow-hidden",
          mode === APP_MODE.EDIT && sidebarLeftCollapsed && "admin-layout--sidebar-collapsed"
        )} 
        data-mode={mode}
      >
        <Layout.Header dark={theme === "dark"}>
          <TooltipProvider delayDuration={100}>
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <ToggleGroup
                  type="single"
                  size="sm"
                  variant="outline"
                  value={mode}
                  onValueChange={handleModeChange}
                  aria-label="Basculer le mode de l’éditeur"
                  className="rounded-lg border border-border bg-background p-1 shadow-sm"
                >
                  <ToggleGroupItem
                    value={APP_MODE.EDIT}
                    aria-label="Mode édition"
                  >
                    <PenSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Édition</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={APP_MODE.PREVIEW}
                    aria-label="Mode prévisualisation"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Prévisualisation</span>
                  </ToggleGroupItem>
                </ToggleGroup>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="gap-2"
                >
                  {isFullScreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        Quitter le plein écran
                      </span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Plein écran</span>
                    </>
                  )}
                </Button>
                <Separator orientation="vertical" className="hidden h-6 lg:block" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {theme === "dark" ? "Mode clair" : "Mode sombre"}
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!canUndo}
                        onClick={undo}
                        aria-label="Annuler la dernière action"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Annuler</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!canRedo}
                        onClick={redo}
                        aria-label="Rétablir la dernière action"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rétablir</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                value={breakpoint}
                onValueChange={handleBreakpointChange}
                aria-label="Sélectionner le breakpoint de prévisualisation"
                className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-sm"
              >
                <ToggleGroupItem value="mobile" aria-label="Vue mobile">
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">Mobile</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="tablet" aria-label="Vue tablette">
                  <Tablet className="h-4 w-4" />
                  <span className="hidden xl:inline">Tablette</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="desktop" aria-label="Vue bureau">
                  <Monitor className="h-4 w-4" />
                  <span className="hidden xl:inline">Bureau</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </TooltipProvider>
        </Layout.Header>
  
        <Layout.Canvas>
          <NodeWrapper />
        </Layout.Canvas>
        {mode === APP_MODE.EDIT && (
          <Layout.SidebarLeft 
            collapsed={sidebarLeftCollapsed}
            onToggle={() => setSidebarLeftCollapsed(!sidebarLeftCollapsed)}
            dark={theme === "dark"}
          >
            <Card className="bg-card shadow-sm backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle>Bibliothèque de blocs</CardTitle>
                <CardDescription>
                  Glissez et déposez un bloc pour l&apos;ajouter au canvas.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <PanelButtons />
              </CardContent>
            </Card>
          </Layout.SidebarLeft>
        )}
        {mode === APP_MODE.EDIT && (
          <Layout.SidebarRight dark={theme === "dark"}>
            <NodeSettings />
          </Layout.SidebarRight>
        )}
        
        {mode === APP_MODE.EDIT && !isAutoSaveActive && (
          <Layout.Footer>
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <span className="text-muted-foreground">
                Les modifications sont sauvegardées automatiquement.
              </span>
              <Button size="sm" onClick={save} variant="outline" className="gap-1">
                Sauvegarder maintenant
              </Button>
            </div>
          </Layout.Footer>
        )}
        </div>
    </DragDropProvider>
  );
}

export default Builder;