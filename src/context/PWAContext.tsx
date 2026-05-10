"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PWAContextType {
  canInstall: boolean;
  installApp: () => Promise<void>;
  isInstalled: boolean;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType>({
  canInstall: false,
  installApp: async () => {},
  isInstalled: false,
  showInstructions: false,
  setShowInstructions: () => {},
});

export const usePWA = () => useContext(PWAContext);

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("PWA Install Prompt Ready");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback: Show instructions for iOS or browsers that don't support beforeinstallprompt
      setShowInstructions(true);
    }
  };

  // canInstall is now always true if not already installed, so the button is permanent
  const canInstall = !isInstalled;

  return (
    <PWAContext.Provider value={{ canInstall, installApp, isInstalled, showInstructions, setShowInstructions }}>
      {children}
    </PWAContext.Provider>
  );
};
