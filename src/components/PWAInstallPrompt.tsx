import { useState, useEffect } from "react";
import { X, Download, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream;

  useEffect(() => {
    const alreadyInstalled = (window.matchMedia("(display-mode: standalone)").matches) ||
                            (document.referrer.includes("android-app://")) ||
                            ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);

    if (!alreadyInstalled) {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
        localStorage.setItem("pwa-installed", "true");
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      setShowPrompt(false);
      localStorage.setItem("pwa-install-dismissed", "true");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt || isInstalled) return null;

  if (showIOSInstructions) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Share className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1">
                  Install on iOS
                </h3>
                <p className="text-sm text-white/80 mb-3">
                  1. Tap the Share button <Share className="w-4 h-4 inline" /> at the bottom
                  <br />
                  2. Scroll down and tap "Add to Home Screen"
                  <br />
                  3. Tap "Add" to install
                </p>
                <button
                  onClick={handleDismiss}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">
                Install Mlimi Smart App
              </h3>
              <p className="text-sm text-white/80 mb-3">
                Add to your home screen for the best experience. Works offline!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {deferredPrompt ? "Install" : isIOS ? "Show Instructions" : "Install"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}