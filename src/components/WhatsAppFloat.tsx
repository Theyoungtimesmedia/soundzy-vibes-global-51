import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppFloatProps {
  className?: string;
}

export function WhatsAppFloat({ className = '' }: WhatsAppFloatProps) {
  // Temporarily disabled the floating WhatsApp widget.
  return null;
}          className="w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
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
