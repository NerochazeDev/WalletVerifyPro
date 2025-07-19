import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Clock, MapPin, Monitor } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityAlertPageProps {
  onVerifyNow: () => void;
}

export default function SecurityAlertPage({ onVerifyNow }: SecurityAlertPageProps) {
  const [timeLeft, setTimeLeft] = useState(59 * 60 + 1); // 59:01 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <Card className="bg-slate-800/50 border-red-500/20 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30"
                >
                  <AlertTriangle className="text-red-400 text-2xl" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-white mb-3">
                  Security Alert Detected
                </h1>
                <p className="text-red-400 font-medium text-lg">
                  Unauthorized Login Attempts Detected
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 font-medium">Time Remaining to Secure Account</span>
                  </div>
                  <div className="text-6xl font-mono font-bold text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-slate-300">
                    Action required to prevent account lockdown
                  </p>
                </div>
              </div>

              {/* Threat Details */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Threat Details</h3>
                
                <div className="grid gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-orange-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white mb-1">Suspicious Location</h4>
                        <p className="text-sm text-slate-300">
                          Login attempts detected from: <span className="text-orange-400">Unknown Location</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-start space-x-3">
                      <Monitor className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white mb-1">Unrecognized Device</h4>
                        <p className="text-sm text-slate-300">
                          Device fingerprint: <span className="text-yellow-400">Not in trusted devices</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white mb-1">Failed Authentication</h4>
                        <p className="text-sm text-slate-300">
                          Multiple failed login attempts: <span className="text-red-400">7 attempts in last hour</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Required */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Immediate Action Required</h4>
                    <p className="text-slate-300 mb-4">
                      To protect your crypto assets, you must verify your wallet ownership immediately. 
                      This will activate advanced security protocols and block unauthorized access attempts.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Verify wallet ownership with secure credentials</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Enable device fingerprinting and recognition</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Activate real-time threat monitoring</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verify Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onVerifyNow}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Shield className="mr-3 h-6 w-6" />
                  Verify Now & Secure Account
                </Button>
              </motion.div>

              {/* Footer Warning */}
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                  <strong className="text-red-400">Warning:</strong> Failure to verify within the time limit may result in temporary account restrictions for your security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WalletSecure Branding */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Powered by WalletSecure</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Advanced crypto wallet security and threat protection
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}