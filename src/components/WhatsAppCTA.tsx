import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WhatsAppCTAProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  prefillText?: string;
}

export function WhatsAppCTA({ 
  className = '', 
  size = 'lg', 
  showLabel = true,
  prefillText = "Hi, I'm interested in Soundzy Global services. Can you help me?"
}: WhatsAppCTAProps) {
  const phoneNumber = '+2348166687167';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(prefillText)}`;

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14', 
    lg: 'h-16 w-16'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className={`fixed bottom-6 left-6 z-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Button
          asChild
          className={`${sizeClasses[size]} rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white`}
        >
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle className={`${iconSizes[size]} text-white`} />
          </a>
        </Button>
        
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-soft border"
          >
            Chat on WhatsApp
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}