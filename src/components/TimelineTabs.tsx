import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimelineSection = { date?: string; text: string };
type TimelineItem = {
  id: string;
  title: string;
  period: string;
  image: string;
  icon: string;
  sections: TimelineSection[];
  closing?: string[];
};

const timelineData: TimelineItem[] = [
  {
    id: "first-meet",
    title: "Awal Bertemu",
    period: "Jan 2017",
    image: "/images/prewed/1.png",
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
    image: "/images/prewed/2.png",
    icon: "/images/our-story/first-date.svg",
    sections: [
      {
        date: "19 Maret 2017",
        text: "Bagas mengajak Firda Ibadah Sore dan datang untuk mengutarakan perasaanya.",
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
    image: "/images/prewed/3.png",
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
    image: "/images/prewed/4.png",
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
                        <span className="font-semibold text-primary">
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
