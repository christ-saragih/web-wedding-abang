import * as React from "react";
import { cn } from "@/lib/utils";
import { ImagesIcon, XIcon } from "@phosphor-icons/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export type ImageItem = {
  src: string;
  alt: string;
  caption: string;
  size: "tall" | "medium" | "short";
  imgClass?: string;
};

interface GalleryInteractiveProps {
  images: ImageItem[];
  initialCount?: number;
}

export function GalleryInteractive({
  images,
  initialCount = 9,
}: GalleryInteractiveProps) {
  const [visibleCount, setVisibleCount] = React.useState(initialCount);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const hasMore = images.length > visibleCount;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll(".fade-in");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleCount]);

  // Distribute images into 3 masonry columns
  const columns = 3;
  const cols: { item: ImageItem; originalIndex: number }[][] = Array.from(
    { length: columns },
    () => []
  );

  images.forEach((img, idx) => {
    cols[idx % columns].push({ item: img, originalIndex: idx });
  });

  const handleLoadMore = () => {
    setVisibleCount(images.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      {/* Masonry Grid */}
      <div className="masonry-grid" ref={containerRef}>
        {cols.map((col, colIdx) => (
          <div key={colIdx} className="masonry-column" data-col={colIdx}>
            {col.map(({ item: img, originalIndex }) => {
              const isHidden = originalIndex >= visibleCount;
              const sizeClass =
                img.size === "tall"
                  ? "masonry-tall"
                  : img.size === "short"
                  ? "masonry-short"
                  : "masonry-medium";

              if (isHidden) return null;

              return (
                <div
                  key={originalIndex}
                  className={cn("fade-in group cursor-pointer")}
                  onClick={() => setSelectedIndex(originalIndex)}
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
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                        img.imgClass
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                      <p className="text-white font-semibold">{img.caption}</p>
                    </div>
                    <div className="absolute inset-0 bg-gold/20 scale-0 group-hover:scale-100 transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12 fade-in view-more-wrapper">
          <button
            type="button"
            onClick={handleLoadMore}
            className="bg-gold text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 shadow-lg"
          >
            <ImagesIcon size={24} weight="fill" />
            Lihat Lebih Banyak
          </button>
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          className="max-w-5xl w-full bg-transparent border-none shadow-none p-0 overflow-hidden sm:max-w-5xl"
          onKeyDown={handleKeyDown}
          showCloseButton={false} // We'll add our own close button or rely on clicking outside
        >
          <DialogTitle className="sr-only">
            {selectedImage?.caption || "Gallery Image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detail view of {selectedImage?.caption}
          </DialogDescription>

          <div className="relative w-full h-[80vh] flex items-center justify-center pointer-events-none">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 pointer-events-auto transition-colors">
              <span className="sr-only">Close</span>
              <XIcon size={24} />
            </DialogClose>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={selectedIndex === 0}
              className={cn(
                "absolute left-2 md:left-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors pointer-events-auto",
                selectedIndex === 0 &&
                  "opacity-50 cursor-not-allowed hover:bg-black/50"
              )}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
              {selectedImage && (
                <div className="relative max-h-full max-w-full flex flex-col items-center">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-h-[80vh] w-auto object-contain rounded-md shadow-2xl"
                  />
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={selectedIndex === images.length - 1}
              className={cn(
                "absolute right-2 md:right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors pointer-events-auto",
                selectedIndex === images.length - 1 &&
                  "opacity-50 cursor-not-allowed hover:bg-black/50"
              )}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
