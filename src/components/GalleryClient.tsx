import * as React from "react";
import { cn } from "@/lib/utils";
import { ImagesIcon, XIcon } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export type ImageItem = {
  src: string;
  alt: string;
  caption: string;
  size: "tall" | "medium" | "short";
  imgClass?: string;
};

interface GalleryClientProps {
  images: ImageItem[];
  initialCount?: number;
}

export default function GalleryClient({
  images,
  initialCount = 9,
}: GalleryClientProps) {
  const [visibleCount, setVisibleCount] = React.useState(initialCount);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();

  // Masonry Logic
  const columns = 3;
  const cols: { item: ImageItem; originalIndex: number }[][] = Array.from(
    { length: columns },
    () => []
  );

  images.forEach((img, idx) => {
    cols[idx % columns].push({ item: img, originalIndex: idx });
  });

  const hasMore = images.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(images.length);
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  React.useEffect(() => {
    if (api && dialogOpen) {
      api.scrollTo(selectedIndex, true);
    }
  }, [api, dialogOpen, selectedIndex]);

  return (
    <>
      <div className="masonry-grid">
        {cols.map((col, colIdx) => (
          <div key={colIdx} className="masonry-column" data-col={colIdx}>
            {col.map(({ item: img, originalIndex }, localIdx) => {
              const isHidden = originalIndex >= visibleCount;
              if (isHidden) return null;

              const sizeClass =
                img.size === "tall"
                  ? "masonry-tall"
                  : img.size === "short"
                  ? "masonry-short"
                  : "masonry-medium";

              return (
                <div
                  key={originalIndex}
                  className={cn("fade-in show group cursor-pointer")}
                  onClick={() => handleImageClick(originalIndex)}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg shadow-xl",
                      sizeClass
                    )}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={cn("w-full h-full object-cover", img.imgClass)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                      <p className="text-white font-semibold">{img.caption}</p>
                    </div>
                    <div className="absolute inset-0 bg-gold/20 scale-0 group-hover:scale-100 transition-smooth"></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12 fade-in show view-more-wrapper">
          <button
            type="button"
            onClick={handleLoadMore}
            className="bg-gold text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-smooth hover:scale-105 inline-flex items-center gap-3 shadow-lg cursor-pointer"
          >
            <ImagesIcon size={24} weight="fill" />
            Lihat Lebih Banyak
          </button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="md:max-w-[95vw] max-w-full w-full h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Gallery Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Image gallery carousel
          </DialogDescription>

          <DialogClose className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm cursor-pointer">
            <XIcon size={24} weight="bold" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <Carousel
            setApi={setApi}
            opts={{
              startIndex: selectedIndex,
              loop: true,
            }}
            className="w-full md:max-w-5xl max-md:pb-16"
          >
            <CarouselContent className="items-center">
              {images.map((img, idx) => (
                <CarouselItem
                  key={idx}
                  className="flex items-center justify-center h-full"
                >
                  <div className="relative w-full h-full flex flex-col items-center justify-center md:p-4">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="max-h-[80vh] w-full md:w-auto object-contain rounded-md shadow-2xl"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="md:left-4 max-md:left-[calc(50%-3.5rem)] max-md:top-auto max-md:bottom-2 max-md:translate-y-0 bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12" />
            <CarouselNext className="md:right-4 max-md:right-auto max-md:left-[calc(50%+0.5rem)] max-md:top-auto max-md:bottom-2 max-md:translate-y-0 bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
