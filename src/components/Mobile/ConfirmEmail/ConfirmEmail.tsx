import  { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Music } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        // Voye token an bay Backend ou
        await api.get(`/users/confirm?token=${token}`);
        setStatus('success');
        toast.success("Kont ou aktive avèk siksè!");
        
        // Redirije itilizatè a apre 3 segonn
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        toast.error("Token sa a pa valid ankò.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl text-center">
        
        {/* LOGO H-MIZIK */}
        <div className="flex justify-center mb-8">
          <div className="bg-orange-500 p-3 rounded-2xl rotate-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <Music size={32} className="text-white" />
          </div>
        </div>

        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
            <h1 className="text-xl font-bold text-white uppercase italic">Verifikasyon an kous...</h1>
            <p className="text-zinc-500 text-sm italic font-bold">N ap aktive kont H-Mizik ou a, tann yon ti moman.</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-black text-white uppercase italic">Byenveni nan fanmi an!</h1>
            <p className="text-zinc-400 text-sm">
              Email ou verifye kòrèkteman. Ou pral redirije nan paj koneksyon an...
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-white text-black font-black py-3 rounded-xl uppercase italic hover:bg-orange-500 hover:text-white transition-all"
            >
              Konekte kounye a
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-black text-white uppercase italic">Oups! Gen yon pwoblèm.</h1>
            <p className="text-zinc-400 text-sm">
              Lyen sa a pa bon oswa li ekspire. Tanpri mande yon lòt lyen verifikasyon.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-zinc-800 text-white font-black py-3 rounded-xl uppercase italic hover:bg-white hover:text-black transition-all"
            >
              Retounen nan enskripsyon
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfirmEmail;