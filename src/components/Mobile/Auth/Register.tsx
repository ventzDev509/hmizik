import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const { register, login, magicLink, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [magicLoading, setMagicLoading] = useState<boolean>(false);

  const isProcessing = loading || magicLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register(formData);
      }
    } catch (error) {
      // Erè jere nan Provider
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async () => {
    if (!formData.email) return;
    setMagicLoading(true);
    try {
      await magicLink(formData.email);
    } catch (error) {
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-sans py-20 bg-black overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- LOADER OVERLAY (Orange Theme) --- */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center shadow-2xl"
            >
              <div className="relative">
                <Loader2 className="animate-spin text-orange-600 mb-4" size={45} />
                <div className="absolute inset-0 blur-xl bg-orange-600/20 animate-pulse"></div>
              </div>
              <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] text-center">
                Otorizasyon ap fèt...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#121212] p-8 rounded-3xl shadow-2xl border border-white/5"
      >
        <div className="text-center mb-10">
          <motion.h1
            layout
            className="text-orange-600 text-5xl font-black tracking-tighter mb-2 italic"
          >
            H-MIZIK
          </motion.h1>
          <div className="h-1 w-12 bg-orange-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 text-sm font-medium px-4">
            {isLogin ? 'Bon retou! Konekte pou w tande mizik.' : 'Kreye yon kont pou w dekouvri tout talan yo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-widest">Non Konplè</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Non ak Siyati"
                  className="w-full bg-[#1e1e1e] text-white px-4 py-4 rounded-2xl border border-white/5 focus:border-orange-600 focus:ring-0 outline-none transition-all placeholder:text-gray-600 font-bold shadow-inner"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-widest">Adrès Imèl</label>
            <input
              type="email"
              name="email"
              placeholder="email@egzanp.com"
              className="w-full bg-[#1e1e1e] text-white px-4 py-4 rounded-2xl border border-white/5 focus:border-orange-600 focus:ring-0 outline-none transition-all placeholder:text-gray-600 font-bold shadow-inner"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-widest">
              {isLogin ? 'Modpas' : 'Kreye yon Modpas'}
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-[#1e1e1e] text-white px-4 py-4 rounded-2xl border border-white/5 focus:border-orange-600 focus:ring-0 outline-none transition-all placeholder:text-gray-600 font-bold shadow-inner"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isProcessing}
            style={{ backgroundColor: "#ea580c" }} // orange-600 hex
            className="w-full text-white font-black py-4 rounded-2xl mt-4 transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-[0.2em] text-xs shadow-lg shadow-orange-600/20"
          >
            {isLogin ? 'KONEKTE' : 'ENSRI'}
          </motion.button>
        </form>

        <div className="relative flex py-8 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-black tracking-widest uppercase">Oubyen</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="space-y-4">
          <button
            style={{ backgroundColor: "#1e1e1e" }}
            type="button"
            disabled={isProcessing}
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 text-white font-bold py-4 px-4 rounded-2xl border border-white/5 transition-all transform hover:bg-[#252525] active:scale-95 disabled:opacity-50 shadow-md text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Kontinye ak Google
          </button>

          <button
            style={{ backgroundColor: "#1e1e1e" }}
            type="button"
            disabled={isProcessing}
            onClick={handleMagicLinkSubmit}
            className="w-full flex items-center justify-center gap-3 text-white font-bold py-4 px-4 rounded-2xl border border-white/5 transition-all transform hover:bg-[#252525] active:scale-95 disabled:opacity-50 shadow-md text-sm"
          >
            Konekte ak yon Magic Link
          </button>
        </div>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? "Ou pa gen kont?" : "Ou gen yon kont deja?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-500 font-black transition-all ml-1 uppercase text-xs tracking-wider"
            >
              {isLogin ? 'Enskri' : 'Konekte'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;