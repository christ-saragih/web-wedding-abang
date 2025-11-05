// src/components/WishList.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.client";
import { CaretDownIcon } from "@phosphor-icons/react";

type TimeAgoResult =
  | "baru saja"
  | `${number} detik yang lalu`
  | `${number} menit yang lalu`
  | `${number} jam yang lalu`
  | `${number} hari yang lalu`
  | `${number} bulan yang lalu`
  | `${number} tahun yang lalu`;

export function timeAgoIndo(date: Date | string | number): TimeAgoResult {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 5) return "baru saja";
  if (seconds < 60) return `${seconds} detik yang lalu`;
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days < 30) return `${days} hari yang lalu`;
  if (months < 12) return `${months} bulan yang lalu`;
  return `${years} tahun yang lalu`;
}

export function avatarInitials(name: string): string {
  if (!name) return "?";
  const names = name.trim().split(" ");
  const initials =
    names.length === 1
      ? names[0].charAt(0)
      : names[0].charAt(0) + names[1].charAt(0);
  return initials.toLocaleUpperCase();
}

type Wish = {
  name: string;
  message: string;
  created_at: string;
};

export default function WishList() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 3;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const from = wishes.length;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("guest_messages")
      .select("name,message,created_at", { count: "exact" })
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      // Silently fail but stop loading to avoid blocking UI
      console.error("Failed to load wishes:", error);
      setLoading(false);
      return;
    }

    const newItems = data ?? [];
    setWishes((prev) => [...prev, ...newItems]);

    // Determine if there are more items to load
    const reachedEndByBatch = newItems.length < PAGE_SIZE;
    const reachedEndByCount =
      typeof count === "number" && from + newItems.length >= count;
    if (reachedEndByBatch || reachedEndByCount) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Load initial page
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <h3 className="font-heading text-2xl font-semibold text-primary text-center mb-8">
        Ucapan dari Tamu Undangan
      </h3>

      {wishes.map((w, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-smooth"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                (i + 1) % 2 ? "bg-gold" : "bg-primary"
              }`}
            >
              {avatarInitials(w.name)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                {w.name}
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                {timeAgoIndo(w.created_at)}
              </p>
              <p className="text-gray-700 leading-relaxed">{w.message}</p>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="cursor-pointer text-primary font-semibold hover:text-primary/80 transition-smooth inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Memuat..." : "Lihat Ucapan Lainnya"}</span>
            {!loading && <CaretDownIcon weight="bold" />}
          </button>
        </div>
      )}
    </div>
  );
}
