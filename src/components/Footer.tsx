import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--gold)/0.15)] mb-3">
          <BookOpen className="w-6 h-6 text-[hsl(var(--gold))]" />
        </div>
        <p className="text-sm text-[hsl(var(--gold-light))]">
          موقع القرآن الكريم &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
