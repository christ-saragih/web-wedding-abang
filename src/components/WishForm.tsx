// src/components/WishForm.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase.client";

export default function WishForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.from("guest_messages").insert([
      {
        name: name.trim(),
        message: message.trim(),
      },
    ]);

    if (error) setStatus("err");
    else {
      setStatus("ok");
      setName("");
      setMessage("");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
            placeholder="Masukkan nama kamu..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 font-semibold mb-2"
          >
            Ucapan & Doa
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={500}
            rows={4}
            placeholder="Tulis ucapan dan doa..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth resize-none"
          ></textarea>
        </div>

        <button
          disabled={status === "loading"}
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-smooth hover:scale-105 shadow-lg"
        >
          {status === "loading" ? "Mengirim..." : "Kirim Ucapan"}
        </button>

        {status === "ok" && (
          <p className="text-green-600 text-sm">
            Terima kasih! Ucapanmu menunggu moderasi.
          </p>
        )}
        {status === "err" && (
          <p className="text-red-600 text-sm">Gagal mengirim. Coba lagi ya.</p>
        )}
      </form>
    </div>
  );
}
