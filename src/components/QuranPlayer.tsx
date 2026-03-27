import { useQuranAPI } from "@/hooks/useQuranAPI";
import { BookOpen, Mic, BookMarked, Music } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const QuranPlayer = () => {
  const {
    reciters,
    mpieces,
    availableSurahs,
    selectedReciter,
    selectedMoshaf,
    selectedSurah,
    loading,
    audioRef,
    handleReciterChange,
    handleMoshafChange,
    handleSurahChange,
  } = useQuranAPI();

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            مشغّل القرآن الكريم
          </h2>
          <p className="text-muted-foreground">
            اختر القارئ والرواية والسورة للاستماع
          </p>
        </div>

        {/* Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-8">
          {/* Reciter Selector */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">
                  القارئ
                </label>
              </div>
              <Select
                value={selectedReciter?.toString() || ""}
                onValueChange={(val) => handleReciterChange(Number(val))}
                disabled={loading}
                dir="rtl"
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue
                    placeholder={loading ? "جاري التحميل..." : "اختر القارئ"}
                  />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {reciters.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Riwaya Selector */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">
                  الرواية
                </label>
              </div>
              <Select
                value={selectedMoshaf?.toString() || ""}
                onValueChange={(val) => handleMoshafChange(Number(val))}
                disabled={!selectedReciter || mpieces.length === 0}
                dir="rtl"
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue placeholder="اختر الرواية" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {mpieces.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Surah Selector */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">
                  السورة
                </label>
              </div>
              <Select
                value={selectedSurah?.id.toString() || ""}
                onValueChange={(val) => {
                  const surah = availableSurahs.find(
                    (s) => s.id.toString() === val
                  );
                  if (surah) handleSurahChange(surah);
                }}
                disabled={!selectedMoshaf || availableSurahs.length === 0}
                dir="rtl"
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue placeholder="اختر السورة" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableSurahs.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="max-w-4xl mx-auto border-border/60 shadow-lg bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selectedSurah
                    ? selectedSurah.name
                    : "لم يتم اختيار سورة بعد"}
                </p>
                {selectedReciter && (
                  <p className="text-xs text-muted-foreground">
                    {reciters.find((r) => r.id === selectedReciter)?.name}
                  </p>
                )}
              </div>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-full rounded-lg"
              style={{ direction: "ltr" }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuranPlayer;
