import { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { CropperProps } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCroppedImg } from "@/lib/cropImage";
import { Check, X } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface ImageCropperDialogProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onCropComplete: (croppedBlob: Blob) => void;
}

export function ImageCropperDialog({ open, onClose, file, onCropComplete }: ImageCropperDialogProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load image when file changes and dialog opens
  useEffect(() => {
    if (open && file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`Image exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller file.`);
        setImageSrc(null);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCompletedCrop(null);
      };
      reader.readAsDataURL(file);
    } else if (!open) {
      setImageSrc(null);
      setError(null);
      setCompletedCrop(null);
    }
  }, [open, file]);

  const onCropChange: CropperProps["onCropChange"] = (location) => {
    setCrop(location);
  };

  const onZoomChange: CropperProps["onZoomChange"] = (newZoom) => {
    setZoom(newZoom);
  };

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCompletedCrop(croppedAreaPixels);
    },
    []
  );

  async function handleSave() {
    if (!imageSrc || !completedCrop) return;
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, completedCrop, "image/jpeg", 0.9);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
        onClose();
      }
    } catch {
      setError("Failed to crop image. Please try again.");
    }
    setProcessing(false);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Your Avatar</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        {imageSrc ? (
          <div className="flex flex-col gap-4">
            {/* Cropper */}
            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black/50">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteHandler}
              />
            </div>

            {/* Zoom slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={([val]) => setZoom(val)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground min-w-[3ch] tabular-nums">{zoom.toFixed(1)}x</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={processing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {processing ? "Saving…" : "Apply"}
              </button>
            </div>
          </div>
        ) : (
          !error && (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading image…
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
