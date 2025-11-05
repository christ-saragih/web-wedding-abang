// src/components/RsvpForm.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase.client";
import { SealCheckIcon } from "@phosphor-icons/react";

type Status = "idle" | "loading" | "ok" | "err";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Simple client-side validation mirroring DB constraints
    if (!name.trim()) {
      setFormError("Nama wajib diisi.");
      return;
    }
    if (name.trim().length > 100) {
      setFormError("Nama maksimal 100 karakter.");
      return;
    }
    if (isPresent === null) {
      setFormError("Pilih status kehadiran terlebih dahulu.");
      return;
    }
    if (!Number.isFinite(guests) || guests < 1) {
      setFormError("Jumlah tamu minimal 1 orang.");
      return;
    }

    setStatus("loading");

    const { error } = await supabase.from("rsvp_guests").insert([
      {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        is_present: isPresent,
        number_of_guests: guests,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("err");
      setFormError(
        "Gagal mengirim konfirmasi. Silakan coba lagi dalam beberapa saat."
      );
    } else {
      setStatus("ok");
      // Reset fields (keep isPresent choice to ease multiple submissions)
      setName("");
      setEmail("");
      setPhone("");
      setGuests(1);
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="rsvp-name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Nama Lengkap <span className="text-primary">*</span>
          </label>
          <input
            id="rsvp-name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap kamu"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="rsvp-email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email
          </label>
          <input
            id="rsvp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="rsvp-phone"
            className="block text-gray-700 font-semibold mb-2"
          >
            No. Telepon
          </label>
          <input
            id="rsvp-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xx xxxx xxxx"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth"
          />
        </div>

        {/* Attendance */}
        <div>
          <span className="block text-gray-700 font-semibold mb-3">
            Status Kehadiran <span className="text-primary">*</span>
          </span>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="attendance"
                value="hadir"
                checked={isPresent === true}
                onChange={() => setIsPresent(true)}
                className="w-5 h-5 text-primary focus:ring-gold"
              />
              <span className="text-gray-700 group-hover:text-primary transition-smooth">
                Ya, saya akan hadir
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="attendance"
                value="tidak-hadir"
                checked={isPresent === false}
                onChange={() => setIsPresent(false)}
                className="w-5 h-5 text-primary focus:ring-gold"
              />
              <span className="text-gray-700 group-hover:text-primary transition-smooth">
                Maaf, saya tidak bisa hadir
              </span>
            </label>
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label
            htmlFor="guests-number"
            className="block text-gray-700 font-semibold mb-2"
          >
            Jumlah Tamu <span className="text-primary">*</span>
          </label>
          <select
            id="guests-number"
            value={String(guests)}
            onChange={(e) =>
              setGuests(Math.max(1, parseInt(e.target.value || "1", 10) || 1))
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-smooth"
          >
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
            <option value="3">3 Orang</option>
            <option value="4">4 Orang</option>
            <option value="5">5≥ Orang</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-smooth hover:scale-105 shadow-lg flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {status === "loading" ? (
            "Mengirim..."
          ) : (
            <>
              <SealCheckIcon size={24} weight="fill" />
              Konfirmasi Kehadiran
            </>
          )}
        </button>

        {/* Messages */}
        {formError && <p className="text-red-600 text-sm">{formError}</p>}
        {status === "ok" && !formError && (
          <p className="text-green-600 text-sm">
            Terima kasih! Konfirmasi kehadiran kamu sudah diterima.
          </p>
        )}

        <p className="text-center text-gray-500 text-sm mt-2">
          <span className="text-primary">*</span> Wajib diisi
        </p>
      </form>
    </div>
  );
}
