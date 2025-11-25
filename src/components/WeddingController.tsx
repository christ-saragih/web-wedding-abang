import { useEffect, useState } from "react";
import { Play, Pause, Music } from "lucide-react";

export default function WeddingController() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0);

    // Lock scroll on initial load
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // Initialize audio
    const audioElement = new Audio("/musics/tortorhon-simalungun.mp3");
    audioElement.loop = true;
    audioElement.volume = 1;
    setAudio(audioElement);

    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, []);

  const handleUnlock = () => {
    if (!isUnlocked) {
      // Unlock scroll
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      document.documentElement.style.scrollBehavior = "smooth";
      setIsUnlocked(true);

      // Play music
      if (audio) {
        audio.play().catch((error) => {
          console.log("Auto-play prevented:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMusic = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((error) => {
          console.log("Play prevented:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    // Add event listeners to unlock buttons
    const unlockButtons = document.querySelectorAll("[data-unlock]");

    unlockButtons.forEach((button) => {
      button.addEventListener("click", handleUnlock);
    });

    return () => {
      unlockButtons.forEach((button) => {
        button.removeEventListener("click", handleUnlock);
      });
    };
  }, [isUnlocked, audio]);

  return (
    <>
      {/* Music Control Button - Only show after unlocked */}
      {isUnlocked && (
        <div className="fixed bottom-4 right-6 z-50">
          <div className="relative">
            {/* Ripple effect */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-20 scale-110"></div>
                <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-30 scale-105"></div>
              </>
            )}

            <button
              onClick={toggleMusic}
              className={`relative bg-gradient-to-r from-primary to-gold text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <Music className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes spin-slow {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </>
  );
}
