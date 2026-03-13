import { motion } from 'framer-motion';


const Equalizer = () => (
    <div className="flex items-end gap-[2.5px] h-[17px]">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                className="w-[5px] bg-orange-500 rounded-full"
                animate={{ height: ["20%", "70%", "40%", "90%", "20%"] }}
                transition={{
                    duration: 1.5 + (i * 0.3),
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);

export default Equalizer