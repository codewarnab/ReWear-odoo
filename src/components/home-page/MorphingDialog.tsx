'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transition: any;
  id: string;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

export function MorphingDialog({ 
  children, 
  transition = { type: 'spring', bounce: 0.05, duration: 0.25 },
  id = Math.random().toString(36).substr(2, 9)
}: { 
  children: ReactNode;
  transition?: any;
  id?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MorphingDialogContext.Provider value={{ isOpen, setIsOpen, transition, id }}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({ 
  children, 
  className = '', 
  style = {} 
}: { 
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const context = useContext(MorphingDialogContext);
  if (!context) throw new Error('MorphingDialogTrigger must be used within MorphingDialog');

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      style={style}
      onClick={() => context.setIsOpen(true)}
      layoutId={`dialog-${context.id}`}
      transition={context.transition}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const context = useContext(MorphingDialogContext);
  if (!context) throw new Error('MorphingDialogContainer must be used within MorphingDialog');

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: 2147483647 }}
          onClick={() => context.setIsOpen(false)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MorphingDialogContent({ 
  children, 
  className = '', 
  style = {} 
}: { 
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const context = useContext(MorphingDialogContext);
  if (!context) throw new Error('MorphingDialogContent must be used within MorphingDialog');

  return (
    <motion.div
      className={className}
      style={style}
      layoutId={`dialog-${context.id}`}
      transition={context.transition}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogImage({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div layoutId="dialog-image" className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </motion.div>
  );
}

export function MorphingDialogTitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h3
      layoutId="dialog-title"
      className={className}
    >
      {children}
    </motion.h3>
  );
}

export function MorphingDialogSubtitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      layoutId="dialog-subtitle"
      className={className}
    >
      {children}
    </motion.p>
  );
}

export function MorphingDialogDescription({ 
  children, 
  className = '',
  disableLayoutAnimation = false,
  variants = {}
}: { 
  children: ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: any;
}) {
  const defaultVariants = {
    initial: { opacity: 0, scale: 0.8, y: 100 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 100 },
  };

  return (
    <motion.div
      className={className}
      variants={variants.initial ? variants : defaultVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({ 
  className = '' 
}: { 
  className?: string;
}) {
  const context = useContext(MorphingDialogContext);
  if (!context) throw new Error('MorphingDialogClose must be used within MorphingDialog');

  return (
    <button
      className={`absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors ${className}`}
      onClick={() => context.setIsOpen(false)}
    >
      <X className="h-4 w-4 text-white" />
    </button>
  );
}
