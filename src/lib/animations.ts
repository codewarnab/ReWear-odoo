// Shared animation configurations for framer motion
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Animation props for interactive elements
export const buttonHoverProps = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

// Common transition props
export const createStaggeredTransition = (index: number) => ({
  delay: index * 0.1,
  duration: 0.3
}); 