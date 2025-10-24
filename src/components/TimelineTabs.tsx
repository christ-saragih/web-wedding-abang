import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const timelineData = [
  {
    id: "first-meet",
    title: "First Meet",
    date: "Jan 15, 2020",
    description:
      "Pertemuan pertama kami di acara keluarga besar marga Saragih. Senyuman pertama yang membuat hati berdebar dan momen yang tak terlupakan dalam hidup kami.",
    image: "/images/prewed/1.png",
    icon: "/images/our-story/first-meet.svg",
  },
  {
    id: "first-date",
    title: "First Date",
    date: "Dec 25, 2022",
    description:
      "Kencan pertama kami yang romantis di kafe favorit. Percakapan yang mengalir natural dan tawa yang tak pernah berhenti membuat kami semakin dekat.",
    image: "/images/prewed/2.png",
    icon: "/images/our-story/first-date.svg",
  },
  {
    id: "marriage-proposal",
    title: "Marriage Proposal",
    date: "Mar 10, 2024",
    description:
      "Dengan adat Simalungun yang sakral, keluarga kami melakukan prosesi lamaran yang penuh makna dan berkah. Momen yang dinanti-nantikan akhirnya tiba.",
    image: "/images/prewed/3.png",
    icon: "/images/our-story/marriage-proposal.svg",
  },
  {
    id: "our-engagement",
    title: "Our Engagement",
    date: "Dec 13, 2025",
    description:
      "Kami akan melangsungkan pernikahan dengan adat Batak Simalungun yang penuh berkah dan kebahagiaan. Awal dari perjalanan hidup baru kami bersama.",
    image: "/images/prewed/4.png",
    icon: "/images/our-story/our-engagement.svg",
  },
];

export default function TimelineTabs() {
  return (
    <Tabs defaultValue="first-meet" className="w-full">
      {/* Custom Styled Tabs List */}
      <TabsList className="w-full md:max-w-3xl md:mx-auto mb-10 md:mb-16 bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-8 overflow-x-auto">
        {timelineData.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className="relative bg-transparent text-gray-500 font-serif text-base md:text-lg pb-3 px-2 rounded-none border-b-2 border-transparent transition-all duration-300 hover:text-[#5a7a7a] data-[state=active]:shadow-none"
          >
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>

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
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
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
              <h3 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                {item.title}
              </h3>

              {/* Date */}
              <p className="text-gray-500 font-medium mb-6 text-sm tracking-wider">
                {item.date}
              </p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                {item.description}
              </p>

              {/* Decorative flourish at bottom */}
              <div className="mt-8 flex items-center">
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#5a7a7a] to-transparent"></div>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}

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
      `}</style>
    </Tabs>
  );
}
