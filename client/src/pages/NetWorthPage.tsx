import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  choreTitle: string;
  completedAt: string;
  amountEarned: number;
  timeToComplete: number;
}

interface Kid {
  id: number;
  name: string;
  pocketMoneyAmount: number;
  pocketMoneyFrequency: string;
}

export default function NetWorthPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const navigate = useNavigate();
  const [kid, setKid] = useState<Kid | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [kidId]);

  const fetchData = async () => {
    try {
      // Fetch kid info
      const kidsResponse = await fetch("/api/kids");
      if (kidsResponse.ok) {
        const kids = await kidsResponse.json();
        const currentKid = kids.find((k: Kid) => k.id === parseInt(kidId!));
        setKid(currentKid);
      }

      // Fetch completed tasks
      const tasksResponse = await fetch(`/api/kids/${kidId}/tasks/completed`);
      if (tasksResponse.ok) {
        const completedTasks = await tasksResponse.json();
        setTasks(completedTasks);
        
        // Calculate total earnings
        const total = completedTasks.reduce((sum: number, task: Task) => sum + task.amountEarned, 0);
        setTotalEarnings(total);
      }
    } catch (error) {
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kid?.name}'s Net Worth</h1>
            <p className="text-gray-600">Track your earnings and progress</p>
          </div>
        </div>

        {/* Total Earnings Card */}
        <Card className="mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-6 h-6" />
              Total Earnings
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Money earned from completed chores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">${totalEarnings.toFixed(2)}</div>
            <div className="mt-4 flex items-center gap-2 text-indigo-100">
              <TrendingUp className="w-5 h-5" />
              <span>{tasks.length} tasks completed</span>
            </div>
          </CardContent>
        </Card>

        {/* Pocket Money Info */}
        {kid && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pocket Money Allowance</CardTitle>
              <CardDescription>Your regular pocket money schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    ${kid.pocketMoneyAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    Per {kid.pocketMoneyFrequency}
                  </div>
                </div>
                <Calendar className="w-12 h-12 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task History */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
            <CardDescription>Recent completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No completed tasks yet!</p>
                <p className="text-sm mt-2">Start completing chores to earn money</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{task.choreTitle}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                        <span>{formatDate(task.completedAt)}</span>
                        {task.timeToComplete && (
                          <span className="text-indigo-600">
                            ⏱️ {formatTime(task.timeToComplete)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      +${task.amountEarned.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
