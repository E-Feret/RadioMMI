import { NextResponse } from 'next/server';

export async function GET() {
    // Simulate random metadata
    const songs = [
        { title: "Bohemian Rhapsody", artist: "Queen", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop" },
        { title: "Hotel California", artist: "Eagles", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=200&auto=format&fit=crop" },
        { title: "Stairway to Heaven", artist: "Led Zeppelin", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop" },
        { title: "Imagine", artist: "John Lennon", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=200&auto=format&fit=crop" },
        { title: "Smells Like Teen Spirit", artist: "Nirvana", cover: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=200&auto=format&fit=crop" },
    ];

    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    return NextResponse.json(randomSong);
}
