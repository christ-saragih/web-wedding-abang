import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "@phosphor-icons/react";
import Autoplay from "embla-carousel-autoplay";

type TimelineSection = { date?: string; text: string };
type TimelineItem = {
  id: string;
  title: string;
  period: string;
  images: string[]; // support multiple images
  icon: string;
  sections: TimelineSection[];
  closing?: string[];
};

const timelineData: TimelineItem[] = [
  {
    id: "first-meet",
    title: "Awal Bertemu",
    period: "Jan 2017",
    images: [
      "/images/our-story/first-meet/1.png",
      "/images/our-story/first-meet/2.jpg",
      "/images/our-story/first-meet/3.png",
    ],
    icon: "/images/our-story/first-meet.svg",
    sections: [
      {
        text: "Segalanya bermula pada awal Januari 2017, ketika kami tak sengaja dipertemukan dalam Ibadah Perayaan Natal Oikumene. Lalu Bagas memfollow Instagram Firda dan memulai berkenalan melalui DM hingga berlanjut chat di Line.",
      },
      {
        text: "Siapa sangka, dari perkenalan dua orang asing itu tumbuh rasa yang hangat dan penuh makna.",
      },
    ],
  },
  {
    id: "relationship",
    title: "Menjalin Hubungan",
    period: "Mar 2017",
    images: [
      "/images/our-story/first-date/1.png",
      "/images/our-story/first-date/2.jpg",
      "/images/our-story/first-date/3.jpg",
    ],
    icon: "/images/our-story/first-date.svg",
    sections: [
      {
        date: "19 Maret 2017",
        text: "Bagas mengajak Firda Ibadah Sore dan dating untuk mengutarakan perasaanya.",
      },
      {
        date: "17 April 2017",
        text: "Firda menjawab perasaan Bagas dan kami berdua berkomitmen menjalin hubungan.",
      },
      {
        date: "17 April 2023",
        text: "Bagas memberikan Firda Promise Ring untuk berkomitmen menjalani hubungan ke jenjang yang lebih serius.",
      },
    ],
  },
  {
    id: "engagement",
    title: "Pertunangan",
    period: "Jan—Nov 2025",
    images: [
      "/images/our-story/marriage-proposal/1.jpg",
      "/images/our-story/marriage-proposal/2.jpg",
      "/images/our-story/marriage-proposal/3.jpg",
    ],
    icon: "/images/our-story/marriage-proposal.svg",
    sections: [
      {
        date: "1 Januari 2025",
        text: "Bagas membawa keluarganya datang untuk bersilahturahmi dan menyampaikan niat baik untuk arah tujuan hubungan kami.",
      },
      {
        date: "2 Agustus 2025",
        text: "Bagas beserta keluarga besar datang ke rumah Firda untuk melamar dan mendiskusikan rencana pernikahan.",
      },
      {
        date: "29 November 2025",
        text: "Akhirnya kami melaksanakan Pertunangan/Martumpol.",
      },
    ],
  },
  {
    id: "wedding",
    title: "Pernikahan",
    period: "13 Des 2025",
    images: [
      "/images/our-story/our-engagement/1.jpg",
      "/images/our-story/our-engagement/2.jpg",
      "/images/our-story/our-engagement/3.jpeg",
    ],
    icon: "/images/our-story/our-engagement.svg",
    sections: [
      {
        text: "Setelah menjalin hubungan hampir 9 tahun akhirnya kami akan melangsungkan pernikahan kudus di 13 Desember 2025.",
      },
      {
        text: "Kasih ini bukan kebetulan, melainkan bagian dari rencana Tuhan yang sempurna. Kami percaya, seperti tertulis dalam Pengkhotbah 3:11, ‘Ia membuat segala sesuatu indah pada waktunya.’",
      },
      {
        text: "Dan kini, waktu itu telah tiba — saat kami menyatukan dua hati, dua keluarga, dan dua kehidupan dalam satu kasih yang berasal dari-Nya.",
      },
      {
        text: "#foreFIRwithGAS",
      },
    ],
  },
];

export default function TimelineTabs() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (api && dialogOpen) {
      api.scrollTo(selectedIndex, true);
    }
  }, [api, dialogOpen, selectedIndex]);

  const handleImageClick = (images: string[], index: number) => {
    setCurrentImages(images);
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  return (
    <Tabs defaultValue="first-meet" className="w-full">
      <div className="relative w-full md:max-w-3xl md:mx-auto mb-10 md:mb-16">
        <div className="absolute -right-5 top-0 bottom-0 w-16 bg-gradient-to-l from-cream to-transparent pointer-events-none z-10 md:hidden"></div>

        <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-2 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {timelineData.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="relative bg-transparent text-gray-500 font-heading text-base md:text-lg pb-3 px-2 rounded-none border-b-2 border-transparent transition-all duration-300 hover:text-[#5a7a7a] data-[state=active]:shadow-none whitespace-nowrap snap-start flex-shrink-0"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Contents */}
      {timelineData.map((item) => (
        <TabsContent
          key={item.id}
          value={item.id}
          className="mt-0 animate-fade-in"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            {/* Image Section - Left */}
            <div className="relative group order-2 lg:order-1">
              <Carousel
                className="relative"
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {item.images.map((imgSrc, idx) => (
                    <CarouselItem key={idx}>
                      <div
                        className="relative overflow-hidden rounded-lg shadow-xl cursor-pointer"
                        onClick={() => handleImageClick(item.images, idx)}
                      >
                        <img
                          src={imgSrc}
                          alt={`${item.title} - ${idx + 1}`}
                          className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Content Section - Right */}
            <div className="relative order-1 lg:order-2">
              {/* Decorative line at top */}
              <div className="flex items-center mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                {/* Small couple icon */}
                <div className="mx-4">
                  <img
                    src={item.icon}
                    alt="couple icon"
                    className="w-[70px] h-[70px] md:w-24 md:h-24"
                  />
                </div>
              </div>

              {/* Decorative ornament - top right */}
              <div className="absolute -top-4 -right-4 w-32 h-32 opacity-10 pointer-events-none hidden lg:block">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-[#5a7a7a]"
                >
                  <path
                    fill="currentColor"
                    d="M50,10 Q60,20 50,30 Q40,20 50,10 M70,30 Q80,40 70,50 Q60,40 70,30 M50,50 Q60,60 50,70 Q40,60 50,50"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="font-heading text-2xl md:text-3xl text-primary mb-4">
                {item.title}
              </h3>

              {/* Period */}
              <p className="text-gray-500 font-medium mb-6 text-sm tracking-wider">
                {item.period}
              </p>

              {/* Sections: dated entries or paragraphs */}
              <div className="space-y-4">
                {item.sections.map((s, idx) => (
                  <div
                    key={idx}
                    className="text-gray-600 leading-relaxed text-base md:text-lg"
                  >
                    {s.date ? (
                      <p>
                        <span className="font-medium text-primary">
                          {s.date}:
                        </span>{" "}
                        {s.text}
                      </p>
                    ) : (
                      <p>{s.text}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Decorative flourish at bottom */}
              <div className="mt-8 flex items-center">
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#5a7a7a] to-transparent"></div>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="md:max-w-[95vw] w-full h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center"
        >
          <DialogTitle className="sr-only">
            Timeline Gallery Preview
          </DialogTitle>
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
              {currentImages.map((imgSrc, idx) => (
                <CarouselItem
                  key={idx}
                  className="flex items-center justify-center h-full"
                >
                  <div className="relative w-full h-full flex flex-col items-center justify-center md:p-4">
                    <img
                      src={imgSrc}
                      alt={`Gallery image ${idx + 1}`}
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

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0) translateY(-50%);
          }
          50% {
            transform: translateX(4px) translateY(-50%);
          }
        }

        .animate-bounce-x {
          animation: bounce-x 1.5s ease-in-out infinite;
        }

        /* Custom scrollbar styling for webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* Hide scrollbar for Firefox but keep functionality */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
      `}</style>
    </Tabs>
  );
}
