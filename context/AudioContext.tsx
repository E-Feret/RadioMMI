"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => setIsPlaying((prev) => !prev);

    const toggleMute = () => setIsMuted((prev) => !prev);

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
