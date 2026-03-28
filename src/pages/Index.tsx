import HeroBanner from "@/components/HeroBanner";
import QuranPlayer from "@/components/QuranPlayer";
import QuranBrowser from "@/components/QuranBrowser";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroBanner />
      <QuranPlayer />
      <QuranBrowser />
      <Footer />
    </div>
  );
};

export default Index;
