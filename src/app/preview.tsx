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
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <H1>Preview</H1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={image.edited}
              readOnly
              className="text-sm text-zinc-900"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline">
                  <Scan className="h-4 w-4 text-zinc-900" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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
              size="icon"
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
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <P className="text-center text-muted-foreground">
                No images available for comparison. Please upload a banner to
                get started.
              </P>
              <Button variant="outline" asChild>
                <Link to="/">Upload an Image</Link>
              </Button>
            </div>
          )}

          {image.mask && (
            <Card className="overflow-hidden">
              <CardHeader>
                <H1 className="text-lg">Mask Preview</H1>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={image.mask as string}
                  alt="Mask preview"
                  className="h-auto w-full object-cover"
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-8 pt-6">
          <Button
            variant="outline"
            asChild
            onClick={() => {
              localStorage.clear();
            }}
          >
            <Link to="/">Try Another Image</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
