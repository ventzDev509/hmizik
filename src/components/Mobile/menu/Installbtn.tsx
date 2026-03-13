import { useState, useEffect } from 'react';
import { DownloadCloud } from 'lucide-react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Anpeche Chrome montre èd memwa pa defo a
      e.preventDefault();
      // Sove evènman an pou n itilize l pita
      setDeferredPrompt(e);
      setIsReady(true);
      console.log('✅ PWA Install Prompt ready');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Montre èd memwa enstalasyon an
    deferredPrompt.prompt();

    // Tann itilizatè a reponn
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    // Netwaye pou l pa parèt de fwa
    setDeferredPrompt(null);
    setIsReady(false);
  };

  if (!isReady) return null;

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-6 mx-4 transition-all animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-orange-500 font-bold mb-1 text-lg">H-Mizik sou telefòn ou</h2>
      <p className="text-zinc-400 text-sm mb-4">
        Enstale aplikasyon an pou w ka jwenn li pi fasil epi koute mizik offline nenpòt kote.
      </p>
      <button
        onClick={handleInstallClick}
        className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-orange-500/20"
      >
        <DownloadCloud size={20} />
        Enstale Kounye a
      </button>
    </div>
  );
};

export default InstallButton;