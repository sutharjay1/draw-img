import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useImage } from "@/hooks/use-image";
import { UnsplashReturnType } from "@/types/unsplash-return-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Pencil, Search, SpinnerOne } from "@mynaui/icons-react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { errorToast, successToast } from "../global/toast";
import { getUnsplashImage } from "./actions/get-unsplash-image";
import { uploadToCloudinary } from "./upload-to-cloudinary";

interface BannerUploadDropZoneProps {
  id?: string;
}

const unsplashImageSearchSchema = z.object({ query: z.string() });

type TUnsplashImageSearch = z.infer<typeof unsplashImageSearchSchema>;

export const BannerUploadDropZone: React.FC<BannerUploadDropZoneProps> = ({
  id,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { image, setImage } = useImage();
  const [currentImage, setCurrentImage] = useState<string>(
    image.original || "",
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const form = useForm<TUnsplashImageSearch>({
    resolver: zodResolver(unsplashImageSearchSchema),
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    if (image.original) {
      setCurrentImage(image.original);
    }
  }, [image, setCurrentImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return errorToast("Invalid file type or size", {
          position: "top-center",
        });
      }

      const file = acceptedFiles[0];
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) =>
          prevProgress >= 95 ? prevProgress : prevProgress + 5,
        );
      }, 500);

      try {
        const response = await uploadToCloudinary(file);

        if (response.secure_url) {
          clearInterval(progressInterval);
          setUploadProgress(100);

          setImage({
            original: response.secure_url as string,
            edited: "",
          });

          successToast("Image uploaded successfully", {
            position: "top-center",
          });
          setCurrentImage(response.secure_url);
        } else {
          throw new Error("Upload response missing secure_url");
        }
      } catch (error) {
        clearInterval(progressInterval);
        errorToast("Image upload failed", {
          position: "top-center",
        });
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
    },
    maxSize: 4 * 1024 * 1024,
    disabled: isUploading,
  });

  const handleSelectNewBanner = async (url: string) => {
    setIsUploading(true);
    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) =>
        prevProgress >= 95 ? prevProgress : prevProgress + 5,
      );
    }, 500);

    try {
      setImage({
        original: url,
        edited: "",
      });
      clearInterval(progressInterval);
      setUploadProgress(100);

      successToast("Image uploaded successfully", {
        position: "top-center",
      });
    } catch (error) {
      clearInterval(progressInterval);
      errorToast("Image upload failed", {
        position: "top-center",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<UnsplashReturnType[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["unsplash-image"],
    mutationFn: async ({ query }: TUnsplashImageSearch) => {
      if (!query.trim()) {
        throw new Error("Search query cannot be empty");
      }
      return getUnsplashImage(query, page);
    },
    onSuccess: async (data) => {
      if (data && data.success && Array.isArray(data.results)) {
        const newResults =
          page === 1 ? data.results : [...searchResults, ...data.results];

        setSearchResults(newResults);
        setTotalPages(data.total_pages || 1);
      } else {
        errorToast("No image found", { position: "top-center" });
      }
    },
  });

  const handleLoadMore = async () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);

      try {
        await mutateAsync({ query: form.getValues("query") });
      } catch (err) {
        errorToast(
          err instanceof Error ? err.message : "Something went wrong",
          { position: "top-center" },
        );
      }
    }
  };

  const handleSearch = async () => {
    const currentQuery = form.getValues("query");

    if (!currentQuery.trim()) {
      errorToast("Please type something", { position: "top-center" });
      return;
    }

    setPage(1);
    setSearchResults([]);

    try {
      await mutateAsync({ query: currentQuery });
    } catch (err) {
      errorToast(err instanceof Error ? err.message : "Something went wrong", {
        position: "top-center",
      });
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  useEffect(() => {
    if (!open && searchResults.length > 0) {
      setSearchResults([]);
      form.reset();
    }
  }, [open, searchResults, form]);

  return (
    <div
      className="relative h-[200px] w-full"
      style={{
        height: "400px",
      }}
    >
      {isUploading ? (
        <Card className="flex h-full w-full cursor-progress items-center justify-center">
          <div className="mx-9 flex w-full max-w-md flex-col items-center justify-center text-center">
            <Progress value={uploadProgress} className="h-2" />

            <SpinnerOne className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress >= 90 ? "Processing..." : "Uploading..."}
            </p>
          </div>
        </Card>
      ) : (
        <div
          {...getRootProps()}
          className={`flex h-full w-full cursor-pointer flex-col items-start justify-start rounded-lg transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:bg-muted/10"
          }`}
        >
          {!currentImage && (
            <div className="flex h-full cursor-pointer flex-col items-center justify-center border-4 border-background text-center">
              <CloudUpload className="mb-1 h-24 w-24 text-muted-foreground" />

              <p className="mb-2 text-lg font-semibold">
                Drag & drop or click to upload
              </p>
              <p className="text-sm text-muted-foreground">Image (Up to 4MB)</p>
            </div>
          )}

          <div className="relative flex h-52 w-full overflow-hidden rounded-xl border-4 border-background bg-muted shadow-sm shadow-primary/20">
            {currentImage && (
              <img
                src={currentImage}
                alt="card cover"
                style={{
                  height: "400px",
                }}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute m-2 bg-background p-2 font-normal"
          >
            <input
              type="file"
              className="hidden border border-input shadow"
              accept="image/*"
              aria-label="Upload profile picture"
              {...getInputProps()}
            />
            <Pencil />
          </Button>
        </div>
      )}

      <>
        <div className="flex items-center p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
            className="absolute right-0 top-0 m-2 bg-background font-normal"
          >
            <img
              src={
                "https://res.cloudinary.com/cdn-feedback/image/upload/v1733747539/response/icon-unsplash.svg"
              }
              alt="unsplash"
              width={20}
              height={20}
            />
          </Button>
        </div>
        <Modal open={open} onOpenChange={setOpen}>
          <ModalContent className="h-[32rem] max-w-3xl gap-0 p-0">
            <ModalHeader className="p-4 pb-2">
              <ModalTitle>Search Images</ModalTitle>
            </ModalHeader>

            <div className="border-t p-4">
              <div className="relative">
                <Form {...form}>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem className="relative flex w-full items-center">
                          <Input
                            placeholder="Search for an image"
                            {...field}
                            className="border-0 border-transparent pl-16 pr-10 font-medium text-primary outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-700"
                            onKeyDown={handleKeyDown}
                          />
                          <Search className="absolute right-0 top-0 mr-1 mt-0 h-6 w-6 text-muted-foreground" />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>

            <ScrollArea className="h-64 border-t">
              {isPending && (
                <div className="grid grid-cols-3 gap-4 p-4 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                    >
                      <Skeleton className="absolute inset-0" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 p-4 md:grid-cols-3">
                {searchResults.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSelectNewBanner(image.urls.regular);
                      setOpen(false);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted outline-none transition-colors hover:border-accent-foreground/20 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="absolute inset-0 h-fit bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <img
                      src={image.urls.regular}
                      alt={`Search result ${index + 1}`}
                      className="mb-4 size-full rounded-lg object-contain"
                      sizes="(min-width: 768px) 33vw, 50vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Select Image
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex w-full items-center justify-center pb-3">
                {page < totalPages && searchResults.length > 0 && (
                  <Button
                    onClick={handleLoadMore}
                    disabled={isPending}
                    className="mt-4 w-fit px-6"
                  >
                    {isPending ? "Loading..." : "Load More"}
                  </Button>
                )}
              </div>
            </ScrollArea>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
