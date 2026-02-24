"use client";

import HomeCarousel from "./HomeCarousel";
import OnAirWidget from "./OnAirWidget";
import LiveCTA from "./LiveCTA";
import StudioServices from "./StudioServices";

export default function HeroSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[500px]">

                {/* Column 1: Visual & Program (Left) */}
                <div className="flex flex-col gap-4 h-full">
                    {/* Carousel (Aspect Video) */}
                    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg">
                        <HomeCarousel />
                    </div>
                    {/* OnAir Widget (Fills remaining space) */}
                    <div className="flex-1 min-h-0">
                        <OnAirWidget compact={true} />
                    </div>
                </div>

                {/* Column 2: Services & Interaction (Center) */}
                <div className="h-full">
                    <StudioServices />
                </div>

                {/* Column 3: Live Player (Right) */}
                <div className="h-full">
                    <LiveCTA />
                </div>

            </div>
        </section>
    );
}
