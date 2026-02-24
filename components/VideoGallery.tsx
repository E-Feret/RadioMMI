"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, Clock } from "lucide-react";

// Mock Data
const VIDEOS = [
    {
        id: "feat1",
        title: "Interview exclusive du Maire",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
        type: "feature",
        tag: "À LA UNE",
        duration: "14:20",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "short1",
        title: "Coulisses Studio",
        thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
        type: "short",
        tag: "SHORT",
        duration: "0:59",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "short2",
        title: "Le Fail du jour",
        thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
        type: "short",
        tag: "SHORT",
        duration: "0:30",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "std1",
        title: "Replay : La Matinée du 04/12",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2066&auto=format&fit=crop",
        type: "standard",
        tag: "REPLAY",
        duration: "45:00",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "std2",
        title: "Le Sport : Résumé du Week-end",
        thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop",
        type: "standard",
        tag: "SPORT",
        duration: "12:15",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "std3",
        title: "L'invité surprise de 18h",
        thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
        type: "standard",
        tag: "EXTRA",
        duration: "08:40",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: "std4",
        title: "Concert Live : Best Of",
        thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=2070&auto=format&fit=crop",
        type: "standard",
        tag: "LIVE",
        duration: "55:00",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

export default function VideoGallery() {
    const [selectedVideo, setSelectedVideo] = useState<typeof VIDEOS[0] | null>(null);

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-oxy-blue dark:text-white tracking-tight">
                    Vidéos & Replays
                </h2>
                <button className="text-sm font-bold text-oxy-orange hover:underline">
                    Voir toute la chaîne
                </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">

                {VIDEOS.map((video) => {
                    // Determine grid span based on type
                    let gridClass = "md:col-span-1 md:row-span-1";
                    if (video.type === "feature") gridClass = "md:col-span-2 md:row-span-2";
                    if (video.type === "short") gridClass = "md:col-span-1 md:row-span-2";

                    return (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${gridClass}`}
                            suppressHydrationWarning
                        >
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" suppressHydrationWarning />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" suppressHydrationWarning>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-oxy-orange transition-colors duration-300 shadow-xl" suppressHydrationWarning>
                                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-6 w-full" suppressHydrationWarning>
                                <div className="flex items-center gap-2 mb-2" suppressHydrationWarning>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border border-white/10 shadow-sm ${video.type === 'feature' ? 'bg-oxy-orange text-white' : 'bg-white/20 backdrop-blur-md text-white'
                                        }`}>
                                        {video.tag}
                                    </span>
                                    {video.type === 'feature' && (
                                        <span className="text-white/80 text-xs font-medium flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {video.duration}
                                        </span>
                                    )}
                                </div>
                                <h3 className={`font-bold text-white leading-tight ${video.type === 'feature' ? 'text-2xl md:text-3xl' : 'text-lg'
                                    }`}>
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                        onClick={() => setSelectedVideo(null)}
                    />
                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-oxy-orange/20 animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <iframe
                            src={`${selectedVideo.url}?autoplay=1`}
                            title={selectedVideo.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
