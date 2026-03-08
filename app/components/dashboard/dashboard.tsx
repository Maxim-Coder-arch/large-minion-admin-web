'use client';

import Link from "next/link";
import { dashboardData } from "../../data/data.dashboard";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/dashboard/dashboard.scss";

export default function Dashboard() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            className="dashboard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <motion.div 
        className={`dashboard ${isOpen ? 'open' : 'closed'}`}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
      >
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>LargeMinion</h1>
            <span>Система управления</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          {dashboardData.map((item, index) => {
            const isActive = item.pageLink === pathname;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={item.pageLink}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                  target={item.blank ? '_blank' : ''}
                >
                  <span className="nav-icon">{item.icon || '•'}</span>
                  <span className="nav-text">{item.lable}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="dashboard-footer">
          <button 
            className="toggle-button"
            onClick={toggleDashboard}
            aria-label={isOpen ? "Скрыть панель" : "Показать панель"}
          >
            <motion.div 
              className="toggle-icon"
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              ◀
            </motion.div>
            <span>{isOpen ? 'Свернуть' : 'Развернуть'}</span>
          </button>
          <div className="version">v1.0.0</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="dashboard-open-button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleDashboard}
            aria-label="Открыть панель"
          >
            <span className="open-icon">▶</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}