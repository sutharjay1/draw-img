import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { H2, P } from "@/components/ui/typography";
import Hint from "@/features/global/hint";
import { BannerUploadDropZone } from "@/features/image/image-upload";
import { useImage } from "@/hooks/use-image";
import { ArrowRight } from "@mynaui/icons-react";
import { Link } from "react-router";

export default function Home() {
  const { image } = useImage();

  return (
    <main className="relative z-10 flex h-screen w-full max-w-4xl flex-col items-center justify-center space-y-8 bg-background text-primary">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-3xl shadow-lg">
          <CardHeader className="text-center">
            <H2>Draw-img</H2>
            <P className="text-muted-foreground">
              Easily upload and edit your images
            </P>
          </CardHeader>
          <CardContent className="h-full space-y-6 px-4 pt-0 md:px-6">
            <BannerUploadDropZone />
          </CardContent>
          <CardFooter className="mt-12 flex justify-end">
            <div>
              <Hint
                label={!image.original ? "Upload an image first" : ""}
                side="top"
              >
                <Button
                  variant="outline"
                  className="group"
                  asChild
                  disabled={!image.original}
                >
                  <Link to={!image.original ? "/" : "/edit"}>
                    Continue to Edit
                    <ArrowRight
                      className="ml-2 transition-transform group-hover:translate-x-1"
                      size={20}
                    />
                  </Link>
                </Button>
              </Hint>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
