"use client";

import { useState, useEffect } from "react";

interface Track {
    artist: string;
    title: string;
    cover: string;
}

interface NowPlayingState {
    track: Track;
    loading: boolean;
    error: boolean;
}

const DEFAULT_TRACK: Track = {
    artist: "Radio MMI",
    title: "Le son du département MMI",
    cover: "/assets/logo/logo.svg",
};

const MOCK_TRACKS: Track[] = [
    { artist: "Dua Lipa", title: "Houdini", cover: "https://i.scdn.co/image/ab67616d0000b27346bbb76e4b93d39545b73376" },
    { artist: "The Weeknd", title: "Blinding Lights", cover: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856" },
    { artist: "Miley Cyrus", title: "Flowers", cover: "https://i.scdn.co/image/ab67616d0000b27358039b514812e34e2cda53ce" },
    { artist: "Harry Styles", title: "As It Was", cover: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14" },
];

export function useNowPlaying() {
    const [state, setState] = useState<NowPlayingState>({
        track: DEFAULT_TRACK,
        loading: true,
        error: false,
    });

    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                // Try fetching from API
                const response = await fetch("https://api.radioking.io/widget/radio/oxygene-radio/track/current");

                if (!response.ok) {
                    // Fail silently to fallback to mock data
                    throw new Error("API_FAIL");
                }

                const data = await response.json();

                if (data && (data.artist || data.title)) {
                    setState({
                        track: {
                            artist: data.artist || DEFAULT_TRACK.artist,
                            title: data.title || DEFAULT_TRACK.title,
                            cover: data.cover || DEFAULT_TRACK.cover,
                        },
                        loading: false,
                        error: false,
                    });
                } else {
                    throw new Error("EMPTY_DATA");
                }

            } catch (err) {
                // MOCK DATA FALLBACK
                // Cycle through mock tracks based on time (change every minute)
                const mockIndex = Math.floor(Date.now() / 60000) % MOCK_TRACKS.length;
                const mockTrack = MOCK_TRACKS[mockIndex];

                setState({
                    track: mockTrack,
                    loading: false,
                    error: false, // We don't report error to UI, we just show mock data
                });

                // Only log if it's not the expected API failure (to keep console clean)
                if (err instanceof Error && err.message !== "API_FAIL" && err.message !== "EMPTY_DATA") {
                    console.warn("Using Mock Data for Now Playing");
                }
            }
        };

        // Initial fetch
        fetchNowPlaying();

        // Poll every 15 seconds
        const interval = setInterval(fetchNowPlaying, 15000);

        return () => clearInterval(interval);
    }, []);

    return state;
}
