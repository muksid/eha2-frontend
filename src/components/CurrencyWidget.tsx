import { useState, useEffect } from "react";

const currencies = [
  { country: "Switzerland", code: "CHF", flag: "🇨🇭" },
  { country: "Russia", code: "RUB", flag: "🇷🇺" },
  { country: "USA", code: "USD", flag: "🇺🇸" },
  { country: "Kazakhstan", code: "KZT", flag: "🇰🇿" },
  { country: "Turkey", code: "TRY", flag: "🇹🇷" },
  { country: "Japan", code: "JPY", flag: "🇯🇵" },
];

// Mock rates (in UZS)
const mockRates: Record<string, number> = {
  CHF: 14250,
  RUB: 136,
  USD: 12650,
  KZT: 25.8,
  TRY: 365,
  JPY: 84,
};

export const CurrencyWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % currencies.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentCurrency = currencies[currentIndex];

  return (
    <div
      className="relative w-[140px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Box */}
      <div className="w-[140px] bg-card rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden py-2">
        <div 
          className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <span className="text-2xl">{currentCurrency.flag}</span>
          <div className="text-left">
            <div className="text-xs font-bold text-foreground">{currentCurrency.code}</div>
            <div className="text-[10px] text-muted-foreground">{mockRates[currentCurrency.code].toLocaleString()} UZS</div>
          </div>
        </div>
      </div>

      {/* Expanded Dropdown */}
      {isHovered && (
        <div className="absolute top-full left-0 w-[140px] bg-card rounded-b-lg z-50 overflow-hidden animate-fade-in">
          {currencies.map((currency, index) => (
            <div
              key={currency.code}
              className={`flex items-center gap-2 px-3 py-2 hover:bg-secondary transition-colors ${
                index === currentIndex ? "bg-secondary" : ""
              }`}
            >
              <span className="text-lg">{currency.flag}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-foreground">{currency.code}</div>
                <div className="text-[10px] text-muted-foreground">{mockRates[currency.code].toLocaleString()} UZS</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
