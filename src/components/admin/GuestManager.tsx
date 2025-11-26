import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase.client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  TrashIcon,
  PlusIcon,
  WhatsappLogoIcon,
  SpinnerIcon,
  DownloadSimpleIcon,
  FileXlsIcon,
  CheckCircleIcon,
  UploadSimpleIcon,
  InfoIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type Guest = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  category?: string;
  is_invited?: boolean;
};

type Template = {
  id: string;
  name: string;
  content: string;
};

export default function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template & Send WA states
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [previewMessage, setPreviewMessage] = useState("");

  // Fetch guests & templates
  useEffect(() => {
    fetchGuests();
    fetchTemplates();
  }, []);

  const fetchGuests = async () => {
    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setGuests(data);
  };

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from("chat_templates")
      .select("*")
      .order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setTemplates(data);
      setSelectedTemplateId(data[0].id);
    }
  };

  // Update preview when template or guest changes
  useEffect(() => {
    if (selectedGuest && selectedTemplateId) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      if (template) {
        const domain = window.location.origin;
        const link = `${domain}/to/${selectedGuest.slug}`;
        let msg = template.content;
        msg = msg.replace(/\[nama_tamu\]/g, selectedGuest.name);
        msg = msg.replace(/\[link_undangan\]/g, link);
        setPreviewMessage(msg);
      }
    }
  }, [selectedGuest, selectedTemplateId, templates]);

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
      toast.success("Berhasil menambahkan tamu baru");
    } else {
      toast.error("Gagal menambah tamu (mungkin nama duplikat?)");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("guests").delete().eq("id", deleteId);

    if (error) {
      toast.error("Gagal menghapus tamu");
    } else {
      toast.success("Tamu berhasil dihapus");
      fetchGuests();
    }
    setDeleteId(null);
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

  const openSendDialog = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsSendDialogOpen(true);
  };

  const handleSendWA = () => {
    if (!selectedGuest) return;

    // Format nomor HP
    let phone = selectedGuest.phone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      previewMessage
    )}`;

    // Buka WA
    window.open(url, "_blank");

    // Tandai sebagai sudah dikirim
    markAsInvited(selectedGuest.id);
    setIsSendDialogOpen(false);
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
        toast.error("Gagal membaca file Excel.");
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
      toast.warning("Tidak ada data valid yang ditemukan.");
      setImporting(false);
      return;
    }

    const { error } = await supabase.from("guests").insert(guestsToInsert);

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(
        `Gagal import: ${error.message}. Mungkin ada nama yang duplikat?`
      );
    } else {
      toast.success(`Berhasil mengimport ${guestsToInsert.length} tamu!`);
      fetchGuests();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setImporting(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto mt-0 md:mt-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Manajemen Tamu Undangan
      </h2>

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
          className="w-full border p-2 rounded-md md:flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="No. WA (628...)"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="w-full border p-2 rounded-md md:flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white text-sm md:text-base px-3 md:px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <PlusIcon weight="bold" /> Tambah
        </button>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-green-600 text-white text-sm md:text-base px-3 md:px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 font-medium">
              <FileXlsIcon weight="bold" /> Import Excel
            </button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Import Data Tamu</DialogTitle>
              <DialogDescription>
                Tambahkan banyak tamu sekaligus menggunakan file Excel.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Langkah 1: Download Template */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <InfoIcon /> Langkah 1: Siapkan Data
                </h4>
                <p className="text-sm text-blue-600 mb-3">
                  Download template Excel di bawah ini, lalu isi data tamu kamu
                  sesuai format kolom yang tersedia.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <DownloadSimpleIcon size={18} />
                  Download Template Excel
                </button>
              </div>

              {/* Langkah 2: Upload File */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Langkah 2: Upload File Excel
                </h4>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                    id="dialog-excel-upload"
                    disabled={importing}
                  />
                  <label
                    htmlFor="dialog-excel-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                      importing
                        ? "opacity-50 cursor-not-allowed"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {importing ? (
                        <>
                          <SpinnerIcon className="w-8 h-8 mb-3 text-green-600 animate-spin" />
                          <p className="text-sm text-gray-500">
                            Sedang memproses data...
                          </p>
                        </>
                      ) : (
                        <>
                          <UploadSimpleIcon className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Klik untuk upload
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">XLSX atau XLS</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                      onClick={() => openSendDialog(g)}
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
                      onClick={() => setDeleteId(g.id)}
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

      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Kirim Undangan WhatsApp</DialogTitle>
            <DialogDescription>
              Pilih template pesan yang akan dikirimkan ke{" "}
              <b>{selectedGuest?.name}</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Template
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview Pesan
              </label>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {previewMessage}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={handleSendWA}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <PaperPlaneRightIcon weight="bold" /> Kirim Sekarang
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tamu yang dihapus tidak dapat dikembalikan lagi datanya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
