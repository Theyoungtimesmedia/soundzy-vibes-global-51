import React from 'react';
import { motion } from 'framer-motion';

export function FloatingWhatsApp() {
  const phoneNumber = '+2348166687167';
  const prefillText = "Hi, I'm interested in Soundzy World Global services. Can you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(prefillText)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Contact us on WhatsApp"
        >
          <img 
            src="/assets/icons/whatsapp.png" 
            alt="WhatsApp" 
            className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform" 
          />
        </motion.a>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-background text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-accent/30"
        >
          WhatsApp
        </motion.div>
      </div>
    </motion.div>
  );
}
