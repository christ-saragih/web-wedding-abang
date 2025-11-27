import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BankIcon,
  CopyIcon,
  HouseLineIcon,
  CheckIcon,
  CreditCardIcon,
  PackageIcon,
} from "@phosphor-icons/react";

const bankAccounts = [
  {
    bank: "BCA",
    number: "3410760737",
    name: "Hendro Bagastra Jr Saragih",
    logo: "/images/logo/logo-bca.png",
  },
  {
    bank: "BNI",
    number: "1883502316",
    name: "Firda Ariska Simanjuntak",
    logo: "/images/logo/logo-bni.png",
  },
];

const address =
  "​​​​Jl. Lebung Permai Perumahan Duta Hill Residence Blok H23B Bukit Baru Ilir Barat 1, Palembang";

export default function GiftTabs() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <Tabs defaultValue="cashless" className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none h-auto p-0 gap-2 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <TabsTrigger
            value="cashless"
            className="relative bg-transparent text-gray-500 font-heading text-base md:text-lg pb-3 px-2 rounded-none border-b-2 border-transparent transition-all duration-300 hover:text-[#5a7a7a] data-[state=active]:shadow-none whitespace-nowrap snap-start flex-shrink-0"
          >
            <CreditCardIcon size={20} weight="bold" />
            <span>Cashless</span>
          </TabsTrigger>
          <TabsTrigger
            value="gift"
            className="relative bg-transparent text-gray-500 font-heading text-base md:text-lg pb-3 px-2 rounded-none border-b-2 border-transparent transition-all duration-300 hover:text-[#5a7a7a] data-[state=active]:shadow-none whitespace-nowrap snap-start flex-shrink-0"
          >
            <PackageIcon size={20} weight="bold" />
            <span>Kirim Kado</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cashless" className="animate-fade-in">
        <div className="grid gap-6 md:grid-cols-2">
          {bankAccounts.map((account, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gold/20 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  {account.logo ? (
                    <img
                      src={account.logo}
                      alt={`Logo ${account.bank}`}
                      className={`w-auto object-contain ${
                        account.bank === "BCA" ? "h-7" : "h-6"
                      }`}
                    />
                  ) : (
                    <BankIcon
                      size={24}
                      className="text-primary"
                      weight="duotone"
                    />
                  )}
                  {/* <span className="font-bold text-xl text-gray-800">
                    {account.bank}
                  </span> */}
                </div>

                <div className="space-y-1 mb-6">
                  <p className="text-2xl font-mono text-gray-700 tracking-wider">
                    {account.number}
                  </p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    a.n {account.name}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(account.number, `bank-${index}`)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    copiedId === `bank-${index}`
                      ? "text-green-600"
                      : "text-primary hover:text-primary/80"
                  }`}
                >
                  {copiedId === `bank-${index}` ? (
                    <>
                      <CheckIcon size={18} weight="bold" />
                      <span>Berhasil Disalin</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={18} />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="gift" className="animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gold/20 relative overflow-hidden group hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full -mr-8 -mb-8 transition-transform group-hover:scale-110"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-6">
              <HouseLineIcon size={32} weight="fill" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-800 mb-2">
              Kirim Kado
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan kado fisik, dapat
              dikirimkan ke alamat berikut:
            </p>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 w-full mb-6 text-left">
              <p className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Kediaman Kami
              </p>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200 ml-1">
                {address}
              </p>
            </div>

            <button
              onClick={() => handleCopy(address, "address")}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all transition-smooth flex items-center justify-center gap-2 ${
                copiedId === "address"
                  ? "bg-green-50 text-green-600"
                  : "bg-primary text-white hover:bg-primary/90 hover:scale-105"
              }`}
            >
              {copiedId === "address" ? (
                <>
                  <CheckIcon size={20} weight="bold" />
                  <span>Alamat Berhasil Disalin</span>
                </>
              ) : (
                <>
                  <CopyIcon size={20} />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </TabsContent>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </Tabs>
  );
}
