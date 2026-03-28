import HeroBanner from "@/components/HeroBanner";
import QuranPlayer from "@/components/QuranPlayer";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroBanner />
      <QuranPlayer />
      <Footer />
    </div>
  );
};

export default Index;
