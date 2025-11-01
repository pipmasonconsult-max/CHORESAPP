import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";

interface Kid {
  id: number;
  name: string;
  birthday: string;
  pocketMoneyAmount: string;
  pocketMoneyFrequency: string;
  avatarColor: string;
}

export default function DashboardPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [earnings, setEarnings] = useState<Record<number, number>>({});
  const [currentKidIndex, setCurrentKidIndex] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/kids");
      if (response.ok) {
        const data = await response.json();
        setKids(data);
        
        // Fetch earnings for each kid
        for (const kid of data) {
          fetchEarnings(kid.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch kids:", error);
    }
  };

  const fetchEarnings = async (kidId: number) => {
    try {
      const response = await fetch(`/api/kids/${kidId}/earnings`);
      if (response.ok) {
        const data = await response.json();
        setEarnings((prev) => ({ ...prev, [kidId]: data.total }));
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    }
  };

  const handleKidClick = (kidId: number) => {
    navigate(`/kid/${kidId}/chores`);
  };

  const handleSettings = () => {
    navigate("/manage");
  };

  const handlePrevKid = () => {
    setCurrentKidIndex((prev) => (prev > 0 ? prev - 1 : kids.length - 1));
  };

  const handleNextKid = () => {
    setCurrentKidIndex((prev) => (prev < kids.length - 1 ? prev + 1 : 0));
  };

  const currentKid = kids[currentKidIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-600">
            💰 Chore Tracker
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettings}
            className="h-12 w-12"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Kid Selection */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Who's doing chores today?
          </h2>
          <p className="text-xl text-gray-600">
            Swipe or tap arrows to switch kids
          </p>
        </div>

        {kids.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No kids added yet</p>
            <Button onClick={handleSettings}>Add Kids</Button>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {kids.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevKid}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-16 w-16 rounded-full bg-white/90 shadow-lg hover:bg-white"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextKid}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-16 w-16 rounded-full bg-white/90 shadow-lg hover:bg-white"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Swipeable Kid Cards */}
            <div 
              className="overflow-hidden px-16"
              onTouchStart={(e) => {
                const touchStart = e.touches[0].clientX;
                const handleTouchEnd = (endEvent: TouchEvent) => {
                  const touchEnd = endEvent.changedTouches[0].clientX;
                  const diff = touchStart - touchEnd;
                  if (Math.abs(diff) > 50) {
                    if (diff > 0) handleNextKid();
                    else handlePrevKid();
                  }
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <div className="transition-transform duration-300 ease-in-out">
                {currentKid && (() => {
                  const totalEarnings = earnings[currentKid.id] || 0;
                  const maxEarnings = parseFloat(currentKid.pocketMoneyAmount);
                  const remaining = Math.max(0, maxEarnings - totalEarnings);
                  const percentageEarned = maxEarnings > 0 
                    ? Math.min(100, (totalEarnings / maxEarnings) * 100)
                    : 0;

                  return (
                    <Card
                      className="shadow-2xl hover:shadow-3xl transition-all cursor-pointer transform hover:scale-102 max-w-2xl mx-auto"
                      onClick={() => handleKidClick(currentKid.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <div
                            className="w-40 h-40 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-lg"
                            style={{ backgroundColor: currentKid.avatarColor }}
                          >
                            {currentKid.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <CardTitle className="text-4xl">{currentKid.name}</CardTitle>
                        <CardDescription className="text-xl">
                          {new Date().getFullYear() - new Date(currentKid.birthday).getFullYear()} years old
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base font-medium text-gray-700">Earned</span>
                            <span className="text-3xl font-bold text-green-600">
                              ${totalEarnings.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all"
                              style={{ width: `${percentageEarned}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-gray-600">
                              ${remaining.toFixed(2)} left to earn
                            </span>
                            <span className="text-sm text-gray-600">
                              Max: ${maxEarnings.toFixed(2)} {currentKid.pocketMoneyFrequency}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full text-xl py-8 text-white font-bold"
                          size="lg"
                        >
                          View Chores →
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            </div>

            {/* Dots Indicator */}
            {kids.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {kids.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentKidIndex(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === currentKidIndex 
                        ? 'w-8 bg-indigo-600' 
                        : 'w-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
