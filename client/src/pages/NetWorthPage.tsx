import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, Clock, Camera, DollarSign } from "lucide-react";

interface Task {
  id: number;
  choreId: number;
  kidId: number;
  startedAt: string;
  completedAt: string;
  timeToComplete: number;
  photoUrl: string;
  amountEarned: string;
}

interface Chore {
  id: number;
  title: string;
}

interface TaskWithChore extends Task {
  chore?: Chore;
}

export default function NetWorthPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const [tasks, setTasks] = useState<TaskWithChore[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [chores, setChores] = useState<Record<number, Chore>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (kidId) {
      fetchCompletedTasks();
      fetchTotalEarnings();
    }
  }, [kidId]);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}/completed-tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        
        // Fetch chore details for each task
        const choreIds = Array.from(new Set(data.map((t: Task) => t.choreId)));
        const choreResponse = await fetch("/api/chores");
        if (choreResponse.ok) {
          const allChores = await choreResponse.json();
          const choreMap: Record<number, Chore> = {};
          allChores.forEach((c: Chore) => {
            choreMap[c.id] = c;
          });
          setChores(choreMap);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchTotalEarnings = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}/earnings`);
      if (response.ok) {
        const data = await response.json();
        setTotalEarnings(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const totalTasksCompleted = tasks.length;
  const averageTimePerTask = tasks.length > 0
    ? tasks.reduce((sum, t) => sum + (t.timeToComplete || 0), 0) / tasks.length
    : 0;
  const averageEarningsPerTask = tasks.length > 0
    ? totalEarnings / tasks.length
    : 0;

  // Group tasks by date
  const tasksByDate: Record<string, TaskWithChore[]> = {};
  tasks.forEach((task) => {
    const date = new Date(task.completedAt).toLocaleDateString();
    if (!tasksByDate[date]) {
      tasksByDate[date] = [];
    }
    tasksByDate[date].push(task);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/kid/${kidId}/chores`)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-indigo-600">
            💎 My Net Worth
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Total Earnings Card */}
        <Card className="shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Total Earnings</CardTitle>
            <CardDescription className="text-green-100">
              All-time pocket money earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <DollarSign className="w-16 h-16" />
              <div className="text-6xl font-bold">
                ${totalEarnings.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {totalTasksCompleted}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Total chores done
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Avg Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">
                {formatTime(averageTimePerTask)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Per task
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Avg Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                ${averageEarningsPerTask.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Per task
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Task History */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Task History</CardTitle>
            <CardDescription>
              All your completed chores with photos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(tasksByDate).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tasks completed yet!</p>
                <p className="text-sm mt-2">Start doing chores to see your progress here.</p>
              </div>
            ) : (
              Object.entries(tasksByDate).map(([date, dateTasks]) => (
                <div key={date} className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">
                    {date}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dateTasks.map((task) => (
                      <Card key={task.id} className="shadow-sm border-2">
                        <CardContent className="pt-4">
                          <div className="flex gap-4">
                            {task.photoUrl && (
                              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img
                                  src={task.photoUrl}
                                  alt="Task completion"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">
                                {chores[task.choreId]?.title || "Chore"}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(task.timeToComplete || 0)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Camera className="w-4 h-4" />
                                {formatDate(task.completedAt)}
                              </div>
                              <div className="text-2xl font-bold text-green-600 mt-2">
                                +${task.amountEarned}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
