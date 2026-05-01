import { useState } from "react";
import { motion } from "framer-motion";
import { 
   CheckCircle2, ArrowLeft, Sparkles, Loader2, 
  MapPin, Music2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiInstagram, FiYoutube } from "react-icons/fi";

export default function BecomeArtist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form states ki baze sou Modele Profile ou a
  const [stageName, setStageName] = useState(""); // username nan Profile
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Itilize api.post ou a isit la
      // await api.post('/users/become-artist', { stageName, bio, location, socialLinks });
      
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm">
          <div className="w-24 h-24 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-400/20">
            <CheckCircle2 className="text-orange-400 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Bienvenue Atis!</h1>
          <p className="text-zinc-400 mb-10">Profil ou fin kreye pwofesyonèlman.</p>
          <button onClick={() => navigate('/dashboard-artist')} className="w-full bg-orange-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-400/20 uppercase tracking-widest text-xs">
            Antre nan Studio w
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 font-sans relative overflow-hidden pb-20">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-400/5 blur-[120px] rounded-full" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-zinc-900/50 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Profile Verification</span>
        <div className="w-10" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 max-w-md mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Pwofil <span className="text-orange-400">Atis</span></h2>
          <p className="text-zinc-400 text-sm">Ranpli enfòmasyon sa yo pou piblik la ka konnen w.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Enfòmasyon Debaz */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Enfòmasyon Debaz</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-400 ml-1 mb-2">Non Atis (Obligatwa)</label>
              <input required type="text" placeholder="Ex: Fantom" value={stageName} onChange={(e) => setStageName(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/5 mt-2 rounded-2xl p-4 focus:border-orange-400/50 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Biyografi</label>
              <textarea rows={3} placeholder="Rakonte istwa w..." value={bio} onChange={(e) => setBio(e.target.value)}
                className="w-full bg-zinc-900/40 border mt-2 border-white/5 rounded-2xl p-4 focus:border-orange-400/50 outline-none transition-all resize-none" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 italic flex items-center gap-2">
                <MapPin size={12} /> Lokalizasyon (Opsyonèl)
              </label>
              <input type="text" placeholder="Ex: Port-au-Prince, Haiti" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900/40  border border-white/5 rounded-2xl p-4 focus:border-orange-400/50 outline-none transition-all" />
            </div>
          </div>

          {/* SECTION 2: Social Links (Opsyonèl) */}
          <div className="space-y-6 pt-4">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Rezo Sosyal</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <FiInstagram className="absolute left-4 top-4 text-zinc-600" size={18} />
                <input type="text" placeholder="Username Instagram" value={socialLinks.instagram} 
                  onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                  className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 pl-12 focus:border-orange-400/50 outline-none text-sm" />
              </div>

              <div className="relative">
                <FiYoutube className="absolute left-4 top-4 text-zinc-600" size={18} />
                <input type="text" placeholder="Link Youtube Channel" value={socialLinks.youtube} 
                  onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                  className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 pl-12 focus:border-orange-400/50 outline-none text-sm" />
              </div>

              <div className="relative">
                <Music2 className="absolute left-4 top-4 text-zinc-600" size={18} />
                <input type="text" placeholder="Username TikTok" value={socialLinks.tiktok} 
                  onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                  className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 pl-12 focus:border-orange-400/50 outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* BOUTON SUBMIT */}
          <div className="pt-8">
            <button  type="submit" disabled={loading || !stageName} className="relative w-full group overflow-hidden rounded-2xl bg-zinc-900 p-[1px] transition-all disabled:opacity-30">
              <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#18181b_50%,#f97316_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3 bg-orange-400 rounded-[15px] py-5 group-hover:bg-transparent transition-all">
                {loading ? <Loader2 className="animate-spin text-orange-400" size={20} /> : (
                  <>
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-white">Lanse Pwofil Mwen</span>
                    <Sparkles size={16} className="text-orange-400" />
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}