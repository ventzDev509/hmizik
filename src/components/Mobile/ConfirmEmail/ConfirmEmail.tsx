import { useEffect, useState, useRef, type ReactElement,  } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Music } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import api from '../../../api/axios';


type VerificationStatus = 'loading' | 'success' | 'error';


interface BackendErrorResponse {
  message?: string;
  errorCode?: string;
}

const ConfirmEmail = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const hasRun = useRef<boolean>(false);

  const token: string | null = searchParams.get('token');

  useEffect(() => {
    
    if (!token) {
      setStatus('error');
      return;
    }

    
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyEmail = async (): Promise<void> => {
      try {
        console.log(`📡 H-MIZIK: Eseye verifye token: ${token}`);
        
        
        const response = await api.get<{ success: boolean; message: string }>(
          `/users/confirm?token=${token}`
        );
        
        console.log('✅ H-MIZIK BACKEND REPONS:', response.data);
        
        setStatus('success');
        toast.success("Kont ou aktive avèk siksè!");
        
        
        setTimeout(() => navigate('/auth'), 3000);
      } catch (error) {
        const axiosError = error as AxiosError<BackendErrorResponse>;
        
        
        console.error('❌ ERÈ NAN VERIFIKASYON IMÈL:', axiosError);
        
        if (axiosError.response) {
          console.error('Data erè backend:', axiosError.response.data);
          console.error('Status kòd backend:', axiosError.response.status);
        }
        
        setStatus('error');
        
        
        const serverMessage = axiosError.response?.data?.message;
        toast.error(serverMessage || "Token sa a pa valid ankò oswa li ekspire.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl text-center">
        
        {}
        <div className="flex justify-center mb-8">
          <div className="bg-orange-500 p-3 rounded-2xl rotate-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <Music size={32} className="text-white" />
          </div>
        </div>

        {}
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
            <h1 className="text-xl font-bold text-white uppercase italic">Verifikasyon an kou...</h1>
            <p className="text-zinc-500 text-sm italic font-bold">N ap aktive kont H-Mizik ou a, tann yon ti moman.</p>
          </div>
        )}

        {}
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

        {}
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