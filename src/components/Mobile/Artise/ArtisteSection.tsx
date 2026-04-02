import { useEffect } from "react";
import { useProfile } from "../../../context/ProfileContext";
import ArtistCircle from "./ArtistCircle";

const ArtistSection = () => {
    const { allProfiles, fetchAllProfiles, loading } = useProfile();

    useEffect(() => {
        if (allProfiles?.length === 0) {
            fetchAllProfiles(1, 10);

        }
    }, [allProfiles]);
    return (
        <section className="mt-8">
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white/90 px-4 mb-4">
                Atis <span className="text-orange-500 underline decoration-1 underline-offset-4">k ap monte</span>
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-4 snap-x">
                {allProfiles?.map((profile) => (
                    <div key={profile.id} className="snap-center">
                        <ArtistCircle artist={profile} />
                    </div>
                ))}
                
                {loading && <div className="min-w-[110px] h-24 rounded-full bg-white/5 animate-pulse" />}
            </div>
        </section>
    );
};
export default ArtistSection