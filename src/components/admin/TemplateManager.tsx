import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase.client";
import { toast } from "sonner";
import {
  TrashIcon,
  PlusIcon,
  PencilSimpleIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

type Template = {
  id: string;
  name: string;
  content: string;
};

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from("chat_templates")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setTemplates(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingTemplate) {
      const { error } = await supabase
        .from("chat_templates")
        .update(formData)
        .eq("id", editingTemplate.id);

      if (!error) {
        toast.success("Template berhasil diperbarui");
        fetchTemplates();
        setIsDialogOpen(false);
      } else {
        toast.error("Gagal memperbarui template");
      }
    } else {
      const { error } = await supabase
        .from("chat_templates")
        .insert([formData]);

      if (!error) {
        toast.success("Template berhasil ditambahkan");
        fetchTemplates();
        setIsDialogOpen(false);
      } else {
        toast.error("Gagal menambahkan template");
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase
      .from("chat_templates")
      .delete()
      .eq("id", deleteId);
    if (!error) {
      toast.success("Template berhasil dihapus");
      fetchTemplates();
    } else {
      toast.error("Gagal menghapus template");
    }
    setDeleteId(null);
  };

  const openDialog = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({ name: template.name, content: template.content });
    } else {
      setEditingTemplate(null);
      setFormData({ name: "", content: "" });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto mt-0 md:mt-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Manajemen Template Chat
        </h2>
        <button
          onClick={() => openDialog()}
          className="bg-blue-600 text-white text-sm md:text-base px-3 md:px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <PlusIcon weight="bold" /> Tambah
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{t.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openDialog(t)}
                  className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                >
                  <PencilSimpleIcon size={20} />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <TrashIcon size={20} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 whitespace-pre-wrap h-32 overflow-y-auto">
              {t.content}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Tambah Template"}
            </DialogTitle>
            <DialogDescription>
              Gunakan variabel <code>[nama_tamu]</code> dan{" "}
              <code>[link_undangan]</code> dalam pesan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Template
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: Formal, Keluarga, Batak, dll."
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Isi Pesan
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="text-gray-600 hover:bg-gray-50 p-1 rounded"
                    >
                      <InfoIcon size={20} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <Alert className="bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-900 mt-4">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Format Text WhatsApp</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-blue-800">
                          <li>
                            Gunakan tanda bintang <code>*teks*</code> untuk{" "}
                            <b>tebal</b>
                          </li>
                          <li>
                            Gunakan underscore <code>_teks_</code> untuk{" "}
                            <i>miring</i>
                          </li>
                          <li>
                            Gunakan tilde <code>~teks~</code> untuk{" "}
                            <span className="line-through">coret</span>
                          </li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </PopoverContent>
                </Popover>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-40"
                placeholder="Tulis pesan di sini..."
                required
              />
              <div className="mt-2 text-xs text-gray-500 space-x-2">
                <span
                  className="cursor-pointer bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content: prev.content + " [nama_tamu]",
                    }))
                  }
                >
                  + [nama_tamu]
                </span>
                <span
                  className="cursor-pointer bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content: prev.content + " [link_undangan]",
                    }))
                  }
                >
                  + [link_undangan]
                </span>
              </div>
            </div>

            <DialogFooter>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Template yang dihapus tidak dapat dikembalikan.
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
