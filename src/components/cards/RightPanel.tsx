import { motion, AnimatePresence } from "framer-motion";

interface RightPanelProps {
  music: any;
  onClose: () => void;
}

export default function RightPanel({ music, onClose }: RightPanelProps) {
  return (
    <AnimatePresence>
      {music && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-[350px] bg-neutral-900 text-white p-4 rounded-xl shadow-xl h-screen overflow-y-scroll"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">À propos</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✖</button>
          </div>

          {/* Image */}
          <img
          crossOrigin="anonymous"
            src={music?.cover}
            alt={music?.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          {/* Infos */}
          <h3 className="text-2xl font-bold mb-2">{music?.title}</h3>
          <p className="text-gray-400 mb-4">{music?.subtitle}</p>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            {music?.description || "Aucune description disponible pour cet artiste."}
          </p>

          <button className="mt-6 w-full py-2 bg-green-500 rounded-lg font-semibold hover:bg-green-600">
            Suivre l’artiste
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
