export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-6 border-t border-border bg-card/50">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>© Copyright.  Barcha huquqlar himoyalangan.</span>
        <span>EDO Version 2.0.0</span>
      </div>
    </footer>
  );
};