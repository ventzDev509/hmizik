import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Auth: React.FC = () => {
  const { register, login, magicLink, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState<boolean>(true); // Toggle ant Login ak Register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [magicLoading, setMagicLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Lojik Login (asire w fonksyon login lan egziste nan context la)
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Lojik Register
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
    <div className=" flex items-center justify-center   px-4 font-sans py-20">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#121212] p-4 rounded-xl shadow-2xl border border-[#3836360a]"
      >
        <div className="text-center mb-8">
          <motion.h1
            layout
            className="text-[#1DB954] text-4xl font-black tracking-tighter mb-2 italic"
          >
            H-MIZIK
          </motion.h1>
          <p className="text-gray-400 text-sm font-medium">
            {isLogin ? 'Bon retou! Konekte pou w tande mizik.' : 'Dekouvri mizik ki fè kè w kontan.'}
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
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Kijan w rele?</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Non konplè"
                  className="w-full bg-[#282828] text-white px-4 py-3 rounded-md border border-transparent focus:border-[#1DB954] focus:ring-0 outline-none transition-all placeholder:text-gray-500"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Ki imèl ou?</label>
            <input
              type="email"
              name="email"
              placeholder="email@egzanp.com"
              className="w-full bg-[#282828] text-white px-4 py-3 rounded-md border border-transparent focus:border-[#1DB954] focus:ring-0 outline-none transition-all placeholder:text-gray-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
              {isLogin ? 'Modpas ou' : 'Chwazi yon modpas'}
            </label>
            <input
              type="password"
              name="password"
              placeholder="Omwen 8 karaktè"
              className="w-full bg-[#282828] text-white px-4 py-3 rounded-md border border-transparent focus:border-[#1DB954] focus:ring-0 outline-none transition-all placeholder:text-gray-500"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <motion.button
            style={{color:"#fff",backgroundColor:"#000"}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || magicLoading}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 rounded-full mt-2 transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-wider"
          >
            {loading ? 'Y AP TRAVAY...' : (isLogin ? 'KONEKTE' : 'ENSRI')}
          </motion.button>
        </form>

        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-[#282828]"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold tracking-widest uppercase">Oubyen</span>
          <div className="flex-grow border-t border-[#282828]"></div>
        </div>

        <div className="space-y-3">
          <button
           style={{color:"#fff",backgroundColor:"#000"}}
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-[#282828] text-white font-bold py-3 px-4 rounded-full border border-gray-600 transition-all transform hover:scale-[1.01]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Kontinye ak Google
          </button>

          <button
           style={{color:"#fff",backgroundColor:"#000"}}
            type="button"
            disabled={magicLoading || loading}
            onClick={handleMagicLinkSubmit}
            className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-[#282828] text-white font-bold py-3 px-4 rounded-full border border-gray-600 transition-all transform hover:scale-[1.01] disabled:opacity-50"
          >
            {magicLoading ? 'Voye...' : 'Konekte ak yon Magic Link'}
          </button>
        </div>

        <div className="mt-8 text-center border-t border-[#282828] pt-6">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Ou pa gen kont?" : "Ou gen yon kont deja?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#1DB954] hover:underline font-bold transition-all"
            >
              {isLogin ? 'Enskri isit la.' : 'Konekte isit la.'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;