import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface EarningPeriod {
  id: number;
  totalEarned: string;
  tasksCompleted: number;
  periodStart: string;
  periodEnd: string;
  taskBreakdown: string; // JSON string
}

interface Kid {
  id: number;
  name: string;
  netWealth: string;
  avatarColor: string;
}

export default function NetWorthPage() {
  const { kidId } = useParams();
  const navigate = useNavigate();
  const [kid, setKid] = useState<Kid | null>(null);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [earningPeriods, setEarningPeriods] = useState<EarningPeriod[]>([]);
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [kidId]);

  const fetchData = async () => {
    try {
      // Fetch kid data
      const kidResponse = await fetch(`/api/kids/${kidId}`);
      if (kidResponse.ok) {
        setKid(await kidResponse.json());
      }

      // Fetch current earnings
      const earningsResponse = await fetch(`/api/kids/${kidId}/earnings`);
      if (earningsResponse.ok) {
        const data = await earningsResponse.json();
        setCurrentEarnings(data.total);
      }

      // Fetch earning periods
      const periodsResponse = await fetch(`/api/kids/${kidId}/earning-periods`);
      if (periodsResponse.ok) {
        setEarningPeriods(await periodsResponse.json());
      }
    } catch (error) {
      toast.error("Failed to load net worth data");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!kid) {
    return <div className="p-8 text-center">Kid not found</div>;
  }

  const totalNetWealth = parseFloat(kid.netWealth || '0') + currentEarnings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/kid/${kidId}/chores`)}
            className="h-12 w-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: kid.avatarColor }}
            >
              {kid.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{kid.name}'s Net Worth</h1>
              <p className="text-gray-600">Track your wealth over time</p>
            </div>
          </div>
        </div>

        {/* Total Net Worth Card */}
        <Card className="mb-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Total Net Worth
            </CardTitle>
            <CardDescription className="text-green-100">
              Current earnings + accumulated wealth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-6">
              ${totalNetWealth.toFixed(2)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm text-green-100 mb-1">Current Earnings</div>
                <div className="text-2xl font-bold">${currentEarnings.toFixed(2)}</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm text-green-100 mb-1">Accumulated Wealth</div>
                <div className="text-2xl font-bold">${parseFloat(kid.netWealth || '0').toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Earning Periods */}
        <Card>
          <CardHeader>
            <CardTitle>Earning History</CardTitle>
            <CardDescription>
              View past earning periods and task breakdowns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earningPeriods.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No earning history yet</p>
                <p className="text-sm mt-2">Complete tasks to start building your wealth!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earningPeriods.map((period) => {
                  const tasks = JSON.parse(period.taskBreakdown);
                  const isExpanded = expandedPeriod === period.id;
                  
                  return (
                    <div key={period.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPeriod(isExpanded ? null : period.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg">
                              ${parseFloat(period.totalEarned).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(period.periodStart).toLocaleDateString()} - {new Date(period.periodEnd).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {period.tasksCompleted} tasks completed
                            </div>
                          </div>
                          <div className="text-2xl">
                            {isExpanded ? "▼" : "▶"}
                          </div>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t bg-gray-50 p-4">
                          <h4 className="font-semibold mb-3">Task Breakdown</h4>
                          <div className="space-y-2">
                            {tasks.map((task: any, index: number) => (
                              <div key={index} className="bg-white p-3 rounded border flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{task.choreTitle}</div>
                                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(task.timeToComplete)}
                                    <span className="mx-1">•</span>
                                    {new Date(task.completedAt).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-lg font-semibold text-green-600">
                                  ${parseFloat(task.amountEarned).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
