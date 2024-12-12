import React, { useRef, useState } from "react";

const ImageMerge = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image1, setImage1] = useState<string | ArrayBuffer | null>(null);
  const [image2, setImage2] = useState<string | ArrayBuffer | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const mergeImages = () => {
    if (!canvasRef.current || !image1 || !image2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img1 = new Image();
    const img2 = new Image();

    img1.onload = () => {
      canvas.width = img1.width;
      canvas.height = img1.height;
      ctx.drawImage(img1, 0, 0);

      img2.onload = () => {
        ctx.drawImage(img2, img1.width / 2, 0);
        downloadImage(canvas);
      };
      img2.src = image2 as string;
    };
    img1.src = image1 as string;
  };

  const downloadImage = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "merged-image.png";
    link.click();
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleImageUpload(e, setImage1)} />
      <input type="file" onChange={(e) => handleImageUpload(e, setImage2)} />
      <button onClick={mergeImages}>Merge Images</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageMerge;
