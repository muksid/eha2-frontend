export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-5 px-5 border-t border-border bg-white dark:bg-gradient-to-r dark:from-[#220041] dark:via-[#220041] dark:to-[#8200FA] text-neutral-800 dark:text-white">
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-white/70">
        <span>© {currentYear} Barcha huquqlar himoyalangan.</span>
        <span>EDO Version 2.0.0</span>
      </div>
    </footer>
  );
};
