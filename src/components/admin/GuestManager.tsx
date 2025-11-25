import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase.client";
import {
  TrashIcon,
  PlusIcon,
  WhatsappLogoIcon,
  SpinnerIcon,
  DownloadSimpleIcon,
  FileXlsIcon,
  CheckCircleIcon, // Icon baru untuk indikator sudah dikirim
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";

type Guest = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  category?: string;
  is_invited?: boolean; // Field baru
};

export default function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch guests
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setGuests(data);
  };

  // Generate slug dari nama
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = createSlug(newName);

    const { error } = await supabase
      .from("guests")
      .insert([
        { name: newName, phone: newPhone, slug: slug, is_invited: false },
      ]);

    if (!error) {
      setNewName("");
      setNewPhone("");
      fetchGuests();
    } else {
      alert("Gagal menambah tamu (mungkin nama duplikat?)");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus tamu ini?")) return;
    await supabase.from("guests").delete().eq("id", id);
    fetchGuests();
  };

  // Fungsi baru untuk update status di database
  const markAsInvited = async (id: string) => {
    const { error } = await supabase
      .from("guests")
      .update({ is_invited: true })
      .eq("id", id);

    if (!error) {
      // Update state lokal agar UI langsung berubah tanpa refresh
      setGuests(
        guests.map((g) => (g.id === id ? { ...g, is_invited: true } : g))
      );
    }
  };

  const sendWA = (guest: Guest) => {
    const domain = window.location.origin;
    const link = `${domain}/to/${guest.slug}`;

    // Format nomor HP
    let phone = guest.phone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    const message = `Halo ${guest.name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBerikut link undangan kami:\n${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih,\nBagas & Firda`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Buka WA
    window.open(url, "_blank");

    // Tandai sebagai sudah dikirim
    markAsInvited(guest.id);
  };

  // Fitur excel
  // 1. Download Template
  const downloadTemplate = () => {
    const templateData = [
      {
        "Nama Tamu": "Budi Santoso",
        "Nomor WA": "628123456789",
        "Kategori (Opsional)": "Teman Kantor",
      },
      {
        "Nama Tamu": "Siti Aminah",
        "Nomor WA": "081298765432",
        "Kategori (Opsional)": "Keluarga",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");
    XLSX.writeFile(wb, "template_tamu_undangan.xlsx");
  };

  // 2. Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        await processExcelData(data);
      } catch (error) {
        console.error(error);
        alert("Gagal membaca file Excel.");
        setImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 3. Process Data & Insert to Supabase
  const processExcelData = async (data: any[]) => {
    const guestsToInsert = data
      .map((row) => {
        const name = row["Nama Tamu"] || row["Nama"] || row["name"];
        const phoneRaw = row["Nomor WA"] || row["No HP"] || row["phone"] || "";
        const category =
          row["Kategori (Opsional)"] || row["category"] || "Umum";

        if (!name) return null;

        return {
          name: name,
          phone: String(phoneRaw),
          slug: createSlug(name),
          category: category,
          is_invited: false, // Default belum diundang saat import
        };
      })
      .filter((item) => item !== null);

    if (guestsToInsert.length === 0) {
      alert("Tidak ada data valid yang ditemukan.");
      setImporting(false);
      return;
    }

    const { error } = await supabase.from("guests").insert(guestsToInsert);

    if (error) {
      console.error("Supabase Error:", error);
      alert(`Gagal import: ${error.message}. Mungkin ada nama yang duplikat?`);
    } else {
      alert(`Berhasil mengimport ${guestsToInsert.length} tamu!`);
      fetchGuests();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setImporting(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen Tamu Undangan
        </h2>

        {/* Tombol Aksi Excel */}
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
          >
            <DownloadSimpleIcon size={18} />
            Template Excel
          </button>

          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer ${
                importing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {importing ? (
                <SpinnerIcon className="animate-spin" size={18} />
              ) : (
                <FileXlsIcon size={18} />
              )}
              {importing ? "Mengimport..." : "Import Excel"}
            </label>
          </div>
        </div>
      </div>

      {/* Form Tambah */}
      <form
        onSubmit={handleAdd}
        className="flex gap-4 mb-8 flex-wrap md:flex-nowrap bg-gray-50 p-4 rounded-lg border border-gray-200"
      >
        <input
          type="text"
          placeholder="Nama Tamu"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded-md flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="No. WA (628...)"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="border p-2 rounded-md flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <PlusIcon weight="bold" /> Tambah
        </button>
      </form>

      {/* List Tamu */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Belum ada data tamu.
                </td>
              </tr>
            ) : (
              guests.map((g) => (
                <tr
                  key={g.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    g.is_invited ? "bg-green-50/50" : ""
                  }`}
                >
                  <td className="p-4 font-medium text-gray-900">
                    {g.name}
                    <div className="text-xs text-gray-400 font-normal mt-1">
                      <a
                        href={`/to/${g.slug}`}
                        target="_blank"
                        className="hover:text-blue-600 hover:underline"
                      >
                        /to/{g.slug}
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {g.category || "Umum"}
                    </span>
                  </td>
                  <td className="p-4">
                    {g.is_invited ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircleIcon weight="fill" /> Terkirim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => sendWA(g)}
                      className={`p-2 rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                        g.is_invited
                          ? "bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white"
                          : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white hover:scale-105"
                      }`}
                      title={
                        g.is_invited ? "Kirim Ulang WhatsApp" : "Kirim WhatsApp"
                      }
                    >
                      <WhatsappLogoIcon size={20} weight="fill" />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white hover:scale-105 transition-all shadow-sm"
                      title="Hapus"
                    >
                      <TrashIcon size={20} weight="fill" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
