import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, TrendingUp } from "lucide-react";

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
    // Navigate to settings (password protected)
    navigate("/settings");
  };

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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Who's doing chores today?
          </h2>
          <p className="text-xl text-gray-600">
            Tap your name to see your tasks and earn pocket money!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kids.map((kid) => {
            const totalEarnings = earnings[kid.id] || 0;
            const maxEarnings = parseFloat(kid.pocketMoneyAmount);
            const remaining = Math.max(0, maxEarnings - totalEarnings);
            const percentageEarned = maxEarnings > 0 
              ? Math.min(100, (totalEarnings / maxEarnings) * 100)
              : 0;

            return (
              <Card
                key={kid.id}
                className="shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleKidClick(kid.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg"
                      style={{ backgroundColor: kid.avatarColor }}
                    >
                      {kid.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <CardTitle className="text-3xl">{kid.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {new Date().getFullYear() - new Date(kid.birthday).getFullYear()} years old
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Earned</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${totalEarnings.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentageEarned}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">
                        ${remaining.toFixed(2)} left to earn
                      </span>
                      <span className="text-xs text-gray-600">
                        Max: ${maxEarnings.toFixed(2)} {kid.pocketMoneyFrequency}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full text-lg py-6"
                    size="lg"
                  >
                    Start Earning →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {kids.length === 0 && (
          <Card className="shadow-lg max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 mb-4">
                No kids found. Please set up kid profiles first.
              </p>
              <Button onClick={() => navigate("/setup")}>
                Setup Kids →
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-around">
          <Button
            variant="ghost"
            size="lg"
            className="flex flex-col items-center gap-1"
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="flex flex-col items-center gap-1"
            onClick={handleSettings}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
