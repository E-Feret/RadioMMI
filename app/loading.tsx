import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-oxy-blue/98 backdrop-blur-xl">
            {/* Composite Logo */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Étoile de fond - Tourne sur elle-même (Lente) */}
                <Image
                    src="/assets/logo/elements/etoile.svg"
                    alt="Fond étoilé"
                    fill
                    className="object-contain animate-[spin_8s_linear_infinite]"
                    priority
                />

                {/* Texte principal - Statique au centre */}
                <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 h-[3.5rem] flex justify-center z-10 drop-shadow-lg">
                    <Image
                        src="/assets/logo/elements/texte.svg"
                        alt="Oxygène MMI"
                        width={130}
                        height={100}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Fréquences animées - En dessous du texte, recentrées pour ne pas déborder */}
                <div className="absolute inset-x-0 drop-shadow-md top-[65%] -translate-y-1/2 h-5 flex justify-center items-end gap-[2px] z-20 overflow-hidden">
                    <div className="w-[3px] bg-[#F7B51D] rounded-full animate-audio-bar-1 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-2 origin-bottom"></div>
                    <div className="w-[3px] bg-[#F7B51D] rounded-full animate-audio-bar-3 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-4 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-5 origin-bottom"></div>
                    <div className="w-[3px] bg-[#F7B51D] rounded-full animate-audio-bar-1 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-4 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-3 origin-bottom"></div>
                    <div className="w-[3px] bg-[#F7B51D] rounded-full animate-audio-bar-2 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-5 origin-bottom"></div>
                    <div className="w-[3px] bg-[#2C2C2C] rounded-full animate-audio-bar-1 origin-bottom"></div>
                </div>
            </div>

            {/* Loading Bar */}
            <div className="mt-8 h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-oxy-orange w-1/2 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            </div>

            <p className="mt-4 text-white/60 text-sm font-medium animate-pulse">Connexion aux studios...</p>

            {/* Inject custom keyframes for audio bars right into the component */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bar1 { 0%, 100% { height: 20%; } 50% { height: 80%; } }
                @keyframes bar2 { 0%, 100% { height: 40%; } 50% { height: 100%; } }
                @keyframes bar3 { 0%, 100% { height: 70%; } 50% { height: 30%; } }
                @keyframes bar4 { 0%, 100% { height: 30%; } 50% { height: 100%; } }
                @keyframes bar5 { 0%, 100% { height: 90%; } 50% { height: 20%; } }

                .animate-audio-bar-1 { animation: bar1 1.2s ease-in-out infinite; }
                .animate-audio-bar-2 { animation: bar2 0.8s ease-in-out infinite; }
                .animate-audio-bar-3 { animation: bar3 1.5s ease-in-out infinite; }
                .animate-audio-bar-4 { animation: bar4 1.1s ease-in-out infinite; }
                .animate-audio-bar-5 { animation: bar5 0.9s ease-in-out infinite; }
            `}} />
        </div>
    );
}
