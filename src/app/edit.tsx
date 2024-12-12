import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  errorToast,
  loadingToast,
  successToast,
} from "@/features/global/toast";
import { uploadToCloudinary } from "@/features/image/upload-to-cloudinary";
import { Drawing, useDrawing } from "@/hooks/use-draw";
import { useImage } from "@/hooks/use-image";
import { cn } from "@/lib/utils";
import {
  Download,
  PanelLeftInactive,
  Save,
  Trash,
  Undo,
} from "@mynaui/icons-react";
import { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { SketchPicker } from "react-color";
import { useNavigate } from "react-router";

export const Edit = () => {
  const canvasDrawRef = useRef<CanvasDraw | null>(null);
  const { image, setImage } = useImage();
  const mergeRef = useRef<HTMLCanvasElement | null>(null);
  const { drawing, setDrawing, clearDrawing, undoDrawing } = useDrawing();
  const navigate = useNavigate();

  const [canvasProps, setCanvasProps] = useState({
    brushColor: "#000000",
    brushRadius: 5,
    lazyRadius: 0,
    canvasWidth: 700,
    canvasHeight: 450,
  });

  const handleSave = () => {
    if (canvasDrawRef.current) {
      const data: Drawing = JSON.parse(canvasDrawRef.current.getSaveData());

      setDrawing({
        brushColor: canvasProps.brushColor,
        height: data.height,
        lines: data.lines,
        width: data.width,
        time: new Date(),
      });
    }
  };

  useEffect(() => {
    if (drawing.length > 0) {
      canvasDrawRef.current?.loadSaveData(
        JSON.stringify(drawing[drawing.length - 1]),
      );
    }
  }, [drawing]);

  const handleClear = () => {
    if (canvasDrawRef.current) {
      clearDrawing();
      canvasDrawRef.current?.clear();
    }
  };

  const handleUndo = () => {
    if (canvasDrawRef.current) {
      drawing.map((_, index) => {
        if (index === drawing.length - 1) {
          undoDrawing();
        }
      });
    }
  };

  const handleChangeColor = (e: { hex: string }) => {
    handlePropertyChange("brushColor", e.hex);
    setCanvasProps((prev) => ({
      ...prev,
      brushColor: e.hex,
    }));
  };

  const handlePropertyChange = (
    property: keyof typeof canvasProps,
    value: number | string,
  ) => {
    setCanvasProps((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const downloadImage = async (canvas: HTMLCanvasElement) => {
    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      const file = new File([dataUrl], "image.png", { type: "image/png" });
      const response = await uploadToCloudinary(file);

      if (response.secure_url) {
        setImage({
          original: image.original as string,
          edited: response.secure_url as string,
        });

        successToast("Image uploaded successfully", {
          position: "top-center",
        });

        navigate("/preview");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      errorToast("Error downloading image", {
        position: "top-center",
      });
    }
  };

  const mergeImages = ({
    image,
    dataURI,
  }: {
    image: string | ArrayBuffer | null;
    dataURI: string | ArrayBuffer | null;
  }) => {
    if (!mergeRef.current || !image || !dataURI) return;

    const canvas = mergeRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img1 = new Image();
    const img2 = new Image();

    img1.crossOrigin = "anonymous";
    img2.crossOrigin = "anonymous";

    img1.onload = () => {
      canvas.width = img1.width;
      canvas.height = img1.height;
      ctx.drawImage(img1, 0, 0);

      img2.onload = () => {
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

        downloadImage(canvas);
      };

      img2.src = dataURI as string;
    };

    img1.src = image as string;
  };

  const handleCapture = async () => {
    const pathname = window.location.pathname;
    if (canvasDrawRef.current) {
      const { dismissToast, id } = loadingToast("Extracting image...", {
        duration: 2000,
      });
      // @ts-ignore: Unreachable code error
      const dataURI = canvasDrawRef.current.getDataURL(
        "png",
        true,
        "#FFFFFF00",
      );

      if (image && dataURI) {
        mergeImages({
          image: image.original as string,
          dataURI,
        });
      }
      if (pathname !== "/edit") {
        dismissToast(id as string);
      }
    }
  };

  return (
    <main
      className={cn(
        "relative z-10 flex-col space-y-8 bg-background",
        "flex h-screen items-center justify-center",
      )}
    >
      <div className="container mx-auto px-4">
        {image.original && (
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl shadow-lg">
              <CardContent className="w-full pt-6">
                <div className="mb-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="mr-1 size-20" /> Save
                      </Button>
                      <Button variant="outline" onClick={handleUndo}>
                        <Undo className="mr-1 size-20" /> Undo
                      </Button>
                      <Button variant="outline" onClick={handleCapture}>
                        <Download className="mr-1 size-20" /> Capture
                      </Button>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <PanelLeftInactive className="mr-1 size-20" />
                            Color
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                          <SketchPicker
                            color={canvasProps.brushColor}
                            onChange={handleChangeColor}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleClear}>
                        <Trash className="mr-1 size-20" /> Erase
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-6 pt-4">
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="leading-6">Width</Label>
                          <output className="text-sm font-medium tabular-nums">
                            {canvasProps.canvasWidth}
                          </output>
                        </div>
                        <Slider
                          value={[canvasProps.canvasWidth]}
                          onValueChange={(e) =>
                            handlePropertyChange("canvasWidth", Number(e[0]))
                          }
                          aria-label="Width"
                          max={1000}
                          defaultValue={[700]}
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <Label className="leading-6">Height</Label>
                            <output className="text-sm font-medium tabular-nums">
                              {canvasProps.canvasHeight}
                            </output>
                          </div>
                          <Slider
                            max={1000}
                            value={[canvasProps.canvasHeight]}
                            onValueChange={(e) =>
                              handlePropertyChange("canvasHeight", Number(e[0]))
                            }
                            aria-label="Height"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="leading-6">Brush Radius</Label>
                          <output className="text-sm font-medium tabular-nums">
                            {canvasProps.brushRadius}
                          </output>
                        </div>
                        <Slider
                          value={[canvasProps.brushRadius]}
                          onValueChange={(e) =>
                            handlePropertyChange("brushRadius", Number(e[0]))
                          }
                          aria-label="Brush Radius"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="leading-6">Lazy Radius</Label>
                          <output className="text-sm font-medium tabular-nums">
                            {canvasProps.lazyRadius}
                          </output>
                        </div>
                        <Slider
                          value={[canvasProps.lazyRadius]}
                          onValueChange={(e) =>
                            handlePropertyChange("lazyRadius", Number(e[0]))
                          }
                          aria-label="Lazy Radius"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <CanvasDraw
                  ref={canvasDrawRef as any}
                  brushColor={canvasProps.brushColor}
                  brushRadius={canvasProps.brushRadius}
                  lazyRadius={canvasProps.lazyRadius}
                  canvasWidth={canvasProps.canvasWidth}
                  canvasHeight={canvasProps.canvasHeight}
                  imgSrc={image.original}
                  enablePanAndZoom={true}
                />
                <canvas ref={mergeRef} style={{ display: "none" }} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};
