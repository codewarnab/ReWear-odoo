"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Recycle, Users, ShoppingBag } from "lucide-react";

const tabs = [
  {
    id: "home",
    label: "Home",
    icon: <Home size={18} />,
  },
  {
    id: "swap",
    label: "Swap",
    icon: <Recycle size={18} />,
  },
  {
    id: "community",
    label: "Community",
    icon: <Users size={18} />,
  },
  {
    id: "marketplace",
    label: "Shop",
    icon: <ShoppingBag size={18} />,
  },
];

export default function FluidTabs() {
  const [activeTab, setActiveTab] = useState("home");
  const [touchedTab, setTouchedTab] = useState<string | null>(null);
  const [prevActiveTab, setPrevActiveTab] = useState("home");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleTabClick = (tabId: string) => {
    setPrevActiveTab(activeTab);
    setActiveTab(tabId);
    setTouchedTab(tabId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTouchedTab(null);
    }, 300);
  };

  const getTabIndex = (tabId: string) => tabs.findIndex((tab) => tab.id === tabId);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative flex w-full max-w-lg space-x-2 overflow-hidden rounded-full bg-white/90 backdrop-blur-lg p-1 shadow-2xl border border-gray-200">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeTab}
            className="absolute inset-y-0 my-1 rounded-full bg-black"
            initial={{ x: `${getTabIndex(prevActiveTab) * 100}%` }}
            animate={{ x: `${getTabIndex(activeTab) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${100 / tabs.length}%` }}
          />
        </AnimatePresence>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`relative z-10 flex w-full items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
              activeTab === tab.id ? "font-bold text-white" : "text-gray-600 hover:text-gray-800"
            } ${touchedTab === tab.id ? "blur-sm" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
    </nav>
  );
}
