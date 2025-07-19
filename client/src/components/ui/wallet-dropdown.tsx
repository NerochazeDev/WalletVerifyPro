import { useState } from "react";
import { ChevronDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WalletOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface WalletDropdownProps {
  options: WalletOption[];
  value: WalletOption;
  onChange: (wallet: WalletOption) => void;
  className?: string;
}

export function WalletDropdown({ options, value, onChange, className }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (wallet: WalletOption) => {
    onChange(wallet);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="w-full bg-slate border border-muted rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", value.color)}>
            {value.icon}
          </div>
          <span>{value.name}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate border border-muted rounded-lg shadow-xl z-20 overflow-hidden">
            {options.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-light transition-colors text-left"
                onClick={() => handleSelect(wallet)}
              >
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", wallet.color)}>
                  {wallet.icon}
                </div>
                <span>{wallet.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
