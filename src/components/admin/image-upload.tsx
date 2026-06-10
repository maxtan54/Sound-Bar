"use client";

import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";

import { uploadDishImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadDishImage(formData);
      if (!result.success) throw new Error(result.error);
      return result.data!.url;
    },
    onSuccess: (url) => onChange(url),
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate(file);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="Dish photo"
            fill
            sizes="160px"
            className="object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            className="absolute right-1 top-1"
            aria-label="Remove image"
            onClick={() => onChange("")}
          >
            <X />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {upload.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          {upload.isPending ? "Uploading…" : "Upload photo"}
        </button>
      )}
      <p className="text-xs text-muted-foreground">
        JPEG, PNG or WebP, up to 4 MB.
      </p>
    </div>
  );
}
