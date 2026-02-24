"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { useAudio } from "@/context/AudioContext";

export default function RadioPlayer() {
    const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute } = useAudio();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { track, loading: metadataLoading } = useNowPlaying();

    // Creacast Stream URL (HTTPS forced)
    const STREAM_URL = "https://str0.creacast.com/oxy-melun";

    // ... (useEffect logic remains the same) ...

    // Sync audio element with global state
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                // Force reload to get live stream (avoid time shifting)
                // Cache busting with timestamp
                audioRef.current.src = `${STREAM_URL}?t=${Date.now()}`;
                audioRef.current.load();

                setIsLoading(true);
                setError(false);
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsLoading(false))
                        .catch((err) => {
                            // Ignore AbortError (happens when pausing while loading)
                            if (err.name === "AbortError") {
                                console.log("Playback interrupted by pause");
                            } else {
                                console.error("Playback failed:", err);
                                setError(true);
                            }
                            setIsLoading(false);
                        });
                }
            } else {
                if (!audioRef.current.paused) {
                    audioRef.current.pause();
                    // Optional: reset src to stop buffering
                    audioRef.current.src = "";
                }
            }
        }
    }, [isPlaying]);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const handleError = () => {
        // Ignore errors if we are not trying to play (e.g. when clearing src on pause)
        if (!isPlaying) return;

        console.error("Stream error occurred.");
        setError(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-gradient-oxy-blue/95 backdrop-blur-xl border border-white/20 dark:border-neutral-700 shadow-2xl shadow-oxy-blue/20 rounded-3xl z-50 h-24 transition-all duration-300 hover:scale-[1.01]">
            <audio
                ref={audioRef}
                src={STREAM_URL}
                preload="none"
                onError={handleError}
                muted={isMuted}
            />

            <div className="h-full px-6 flex items-center justify-between">
                {/* Track Info */}
                <div className="flex items-center space-x-4 w-1/3">
                    {/* Cover */}
                    <div className="relative h-12 w-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-white/10">
                        <Image
                            src={track.cover}
                            alt={track.artist}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Text Info */}
                    <div className="hidden sm:block overflow-hidden">
                        {error ? (
                            <div className="flex items-center text-white">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <p className="text-sm font-bold">Flux indisponible</p>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-white truncate leading-tight">
                                        {track.artist}
                                    </p>
                                    {/* Equalizer Animation */}
                                    {isPlaying && (
                                        <div className="flex items-end gap-0.5 h-3 pb-0.5">
                                            <div className="w-0.5 bg-oxy-orange animate-[bounce_1s_infinite] h-full" />
                                            <div className="w-0.5 bg-oxy-orange animate-[bounce_1.2s_infinite] h-2/3" />
                                            <div className="w-0.5 bg-oxy-orange animate-[bounce_0.8s_infinite] h-1/2" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-white/70 truncate font-light">
                                    {track.title}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Play/Pause Control */}
                <div className="flex justify-center w-1/3">
                    <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        disabled={error}
                        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 focus:outline-none shadow-xl shadow-black/20 ${error ? "bg-white/20 cursor-not-allowed" : "bg-white hover:bg-white/90"
                            } text-oxy-blue`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="h-8 w-8 fill-current" />
                        ) : (
                            <Play className="h-8 w-8 fill-current ml-1" />
                        )}
                    </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-end space-x-3 w-1/3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                            if (audioRef.current) {
                                audioRef.current.muted = !isMuted;
                            }
                        }}
                        className="text-white/80 hover:text-white focus:outline-none transition-colors"
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="h-6 w-6" />
                        ) : (
                            <Volume2 className="h-6 w-6" />
                        )}
                    </button>
                    <div className="hidden md:block relative w-24 h-1.5 bg-white/20 rounded-full overflow-hidden group">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
                            aria-label="Volume"
                        />
                        <div
                            className="h-full bg-white rounded-full transition-all duration-150"
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
