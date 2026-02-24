"use client";

import { useState, useEffect } from "react";

interface RadioMetadata {
    title: string;
    artist: string;
    cover: string;
}

export function useRadioMetadata() {
    const [metadata, setMetadata] = useState<RadioMetadata>({
        title: "Chargement...",
        artist: "Radio MMI",
        cover: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=200&auto=format&fit=crop" // Default placeholder
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch('/api/now-playing');
                if (response.ok) {
                    const data = await response.json();
                    setMetadata(data);
                }
            } catch (error) {
                console.error("Failed to fetch metadata:", error);
            }
        };

        // Initial fetch
        fetchMetadata();

        // Poll every 15 seconds
        const interval = setInterval(fetchMetadata, 15000);

        return () => clearInterval(interval);
    }, []);

    return metadata;
}
