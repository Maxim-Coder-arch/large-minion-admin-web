'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/loader/loader.scss';

export default function Loader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    let startTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    const handleClick = () => {
      startTimeout = setTimeout(() => {
        setLoading(true);
      }, 50);
    };
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && !link.target) {
        if (link.href.startsWith(window.location.origin)) {
          handleClick();
        }
      }
    };
    document.addEventListener('click', handleLinkClick);
    const handleComplete = () => {
      clearTimeout(startTimeout);
      if (loading) {
        hideTimeout = setTimeout(() => {
          setLoading(false);
        }, 400);
      } else {
        setLoading(false);
      }
    };

    handleComplete();

    return () => {
      document.removeEventListener('click', handleLinkClick);
      clearTimeout(startTimeout);
      clearTimeout(hideTimeout);
    };
  }, [pathname, searchParams, loading]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          className="loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="loader-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.2
            }}
          >
            <motion.div
              className="loader-spinner"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}