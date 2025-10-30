import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppFloatProps {
  className?: string;
}

export function WhatsAppFloat({ className = '' }: WhatsAppFloatProps) {
  const phoneNumber = '+2348166687167';
  const prefillText = "Hi, I'm interested in Soundzy Global services. Can you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(prefillText)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      <div className="flex flex-col items-end gap-3">
        {/* Chat bubble */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="bg-white text-foreground px-4 py-2 rounded-2xl shadow-lg border max-w-xs"
        >
          <p className="text-sm font-medium">Chat with us!</p>
          <p className="text-xs text-muted-foreground">We're here to help 24/7</p>
        </motion.div>
        
        {/* WhatsApp Button */}
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
            src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" 
            alt="WhatsApp" 
            className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform" 
          />
        </motion.a>
      </div>
    </motion.div>
  );
}