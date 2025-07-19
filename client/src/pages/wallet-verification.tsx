import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, CheckCircle, Wallet, HelpCircle, Check, Unlock, ArrowRight, Download, Loader2, Chrome, CreditCard, Link, Smartphone } from "lucide-react";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { WalletDropdown, type WalletOption } from "@/components/ui/wallet-dropdown";

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: <Chrome className="text-white text-sm" />,
    color: "bg-orange-500"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: <CreditCard className="text-white text-sm" />,
    color: "bg-blue-500"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: <Link className="text-white text-sm" />,
    color: "bg-purple-500"
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: <Shield className="text-white text-sm" />,
    color: "bg-blue-600"
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: <Smartphone className="text-white text-sm" />,
    color: "bg-purple-600"
  },
  {
    id: "bitcoin",
    name: "Bitcoin Wallet",
    icon: <SiBitcoin className="text-white text-sm" />,
    color: "bg-orange-600"
  },
  {
    id: "ethereum",
    name: "Ethereum Wallet",
    icon: <SiEthereum className="text-white text-sm" />,
    color: "bg-gray-600"
  }
];

const steps = [
  { id: 1, title: "Connect", icon: "plug" },
  { id: 2, title: "Verify", icon: "key" },
  { id: 3, title: "Complete", icon: "check" }
];

export default function WalletVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState(walletOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [walletAddress] = useState("0x742d...7a3f");

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setLoadingMessage("Please confirm the connection in your wallet");
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(2);
    }, 2000);
  };

  const handleSignMessage = async () => {
    setIsLoading(true);
    setLoadingMessage("Please sign the message in your wallet");
    
    // Simulate message signing
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3);
    }, 2500);
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
          {/* Step 1: Connect Wallet */}
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
                  <Shield className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Verify Your Wallet</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Connect and verify your wallet to access secure features and enhanced protection for your digital assets.
                </p>
              </div>

              {/* Wallet Selection */}
              <Card className="bg-slate border-muted">
                <CardContent className="p-6">
                  <label className="block text-sm font-medium mb-3">Select Your Wallet</label>
                  <WalletDropdown
                    options={walletOptions}
                    value={selectedWallet}
                    onChange={setSelectedWallet}
                  />
                </CardContent>
              </Card>

              {/* Security Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Why Verify?</h3>
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
                onClick={handleConnectWallet}
                className="w-full gradient-primary text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95"
                size="lg"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </motion.div>
          )}

          {/* Step 2: Verify Ownership */}
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
                <h2 className="text-2xl font-bold mb-3">Verify Ownership</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Sign a message with your wallet to prove ownership. This is completely safe and costs no gas fees.
                </p>
              </div>

              {/* Verification Status */}
              <Card className="bg-slate border-muted">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Wallet Connected</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse-slow"></div>
                      <span className="text-sm text-accent">Connected</span>
                    </div>
                  </div>
                  <div className="bg-slate-light rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
                    <div className="font-mono text-sm">{walletAddress}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Message */}
              <Card className="bg-slate border-muted">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Signature Request</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please sign the following message to verify wallet ownership:
                  </p>
                  <div className="bg-slate-light rounded-lg p-4 border-l-4 border-primary">
                    <div className="text-sm font-mono text-muted-foreground">
                      "I verify ownership of this wallet for SecureConnect platform verification on {currentDate}"
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleSignMessage}
                className="w-full gradient-accent text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 active:scale-95"
                size="lg"
              >
                <Key className="mr-2 h-4 w-4" />
                Sign Message
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
                    <span className="text-sm font-medium">{selectedWallet.name}</span>
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
