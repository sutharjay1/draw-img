import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { H1, P } from "@/components/ui/typography";
import { successToast } from "@/features/global/toast";
import { useImage } from "@/hooks/use-image";
import { cn } from "@/lib/utils";
import { Check, Copy, Scan } from "@mynaui/icons-react";
import { useRef, useState } from "react";
import QrCode from "react-qr-code";
import { Link } from "react-router";

export default function Preview() {
  const { image } = useImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const hasImages = image?.original && image?.edited;

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      successToast("Copied to clipboard", { duration: 1500 });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main
      className={cn(
        "relative z-10 w-full max-w-4xl flex-col space-y-8 bg-background text-primary",
        "flex h-screen items-center justify-center",
      )}
    >
      <nav className="w-full px-4">
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            value={image.edited}
            readOnly
            className="h-7 grow py-4 text-zinc-900"
          />
          <Popover>
            <PopoverTrigger>
              <Button size="sm" variant="outline">
                <Scan size={20} className="text-zinc-900" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <QrCode
                value={image.edited as string}
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                  backgroundColor: "#f3f2f1",
                }}
                viewBox={`0 0 256 256`}
              />
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            variant="outline"
            className={cn("transition-all", copied && "text-green-500")}
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-zinc-900" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-900" />
            )}
          </Button>
        </div>
      </nav>
      <div className="mx-auto w-full max-w-4xl px-4">
        <Card className="mx-auto max-w-3xl shadow-lg">
          <CardHeader className="text-center">
            <H1 className="mb-4">Preview</H1>
          </CardHeader>
          <CardContent className="pt-0">
            {hasImages ? (
              <ImageComparison
                className="aspect-[16/10] w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                enableHover
              >
                <ImageComparisonImage
                  src={image.edited as string}
                  alt="Edited Image"
                  position="left"
                />
                <ImageComparisonImage
                  src={image.original as string}
                  alt="Original Image"
                  position="right"
                />
                <ImageComparisonSlider className="bg-white" />
              </ImageComparison>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <P className="text-muted-foreground">
                  No images available for comparison. Please upload a banner to
                  get started.
                </P>
                <Button variant="outline" className="group" asChild>
                  <Link to="/">
                    <span>Upload an Image</span>
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <CardFooter className="flex items-center justify-center py-4">
          <Button
            variant="outline"
            className="group"
            asChild
            onClick={() => {
              localStorage.clear();
            }}
          >
            <Link to="/">
              <span>Try Another Image</span>
            </Link>
          </Button>
        </CardFooter>
      </div>
    </main>
  );
}