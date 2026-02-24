import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-oxy-blue/98 backdrop-blur-xl">
            {/* Pulsing Logo */}
            <div className="relative w-32 h-32 animate-pulse">
                <Image
                    src="/assets/logo/logo.svg"
                    alt="Chargement..."
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Loading Bar */}
            <div className="mt-8 h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-oxy-orange w-1/2 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            </div>

            <p className="mt-4 text-white/60 text-sm font-medium animate-pulse">Chargement...</p>
        </div>
    );
}
