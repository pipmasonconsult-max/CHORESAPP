import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Check, Clock, TrendingUp } from "lucide-react";

interface Chore {
  id: number;
  title: string;
  description: string;
  paymentAmount: string;
  frequency: "daily" | "weekly" | "monthly";
  choreType: "shared" | "individual";
  isAvailable: boolean;
  completedToday?: boolean;
}

interface ActiveTask {
  taskId: number;
  choreId: number;
  choreTitle: string;
  paymentAmount: string;
  startTime: number;
}

export default function KidChoresPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const [chores, setChores] = useState<Chore[]>([]);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (kidId) {
      fetchAvailableChores();
    }
  }, [kidId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTask) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - activeTask.startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask]);

  const fetchAvailableChores = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}/available-chores`);
      if (response.ok) {
        const data = await response.json();
        setChores(data);
      }
    } catch (error) {
      console.error("Failed to fetch chores:", error);
    }
  };

  const handleStartTask = async (chore: Chore) => {
    try {
      const response = await fetch("/api/tasks/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          choreId: chore.id,
          kidId: parseInt(kidId!),
        }),
      });

      if (response.ok) {
        const task = await response.json();
        setActiveTask({
          taskId: task.id,
          choreId: chore.id,
          choreTitle: chore.title,
          paymentAmount: chore.paymentAmount,
          startTime: Date.now(),
        });
        
        // Start background music
        if (!audioRef.current) {
          audioRef.current = new Audio("/task-music.mp3");
          audioRef.current.loop = true;
          audioRef.current.volume = 0.3;
        }
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
        
        toast({
          title: "Task started!",
          description: `Timer is running for "${chore.title}"`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start task",
        variant: "destructive",
      });
    }
  };

  const handleCompleteClick = async () => {
    setShowCamera(true);
    
    // Small delay to ensure modal renders before requesting camera
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Camera error:", error);
        toast({
          title: "Camera not available",
          description: "You can still complete the task without a photo",
          variant: "destructive",
        });
        // Don't close camera modal - let user choose to cancel or skip photo
      }
    }, 100);
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photo = canvasRef.current.toDataURL("image/jpeg");
        setPhotoData(photo);
        
        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleSubmitTask = async () => {
    console.log("Submit task called", { activeTask, hasPhoto: !!photoData });
    
    if (!activeTask || !photoData) {
      console.error("Missing data:", { activeTask, hasPhoto: !!photoData });
      toast({
        title: "Error",
        description: "Missing task or photo data",
        variant: "destructive",
      });
      return;
    }

    // Stop background music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      console.log("Submitting task:", activeTask.taskId);
      const response = await fetch(`/api/tasks/${activeTask.taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: photoData }),
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Task completed successfully:", result);
        toast({
          title: "Task completed! 🎉",
          description: `You earned $${activeTask.paymentAmount}!`,
        });
        setActiveTask(null);
        setElapsedTime(0);
        setShowCamera(false);
        setPhotoData(null);
        fetchAvailableChores();
      } else {
        const errorText = await response.text();
        console.error("Task completion failed:", response.status, errorText);
        toast({
          title: "Error",
          description: `Failed to complete task (${response.status})`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Task completion error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const groupedChores = {
    daily: chores.filter((c) => c.frequency === "daily"),
    weekly: chores.filter((c) => c.frequency === "weekly"),
    monthly: chores.filter((c) => c.frequency === "monthly"),
  };

  if (showCamera) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header with cancel button */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              // Stop camera if running
              if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
              }
              setShowCamera(false);
              setPhotoData(null);
            }}
            className="text-white hover:bg-white/20"
          >
            ✕ Cancel
          </Button>
          <h2 className="text-white font-semibold">Take Photo</h2>
          <div className="w-20"></div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          {!photoData ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full w-20 h-20"
                  onClick={handleTakePhoto}
                >
                  <Camera className="w-10 h-10" />
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    // Complete task without photo
                    if (!activeTask) return;
                    
                    // Stop camera
                    if (videoRef.current?.srcObject) {
                      const stream = videoRef.current.srcObject as MediaStream;
                      stream.getTracks().forEach(track => track.stop());
                    }
                    
                    // Stop music
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    
                    try {
                      const response = await fetch(`/api/tasks/${activeTask.taskId}/complete`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ photo: null }),
                      });
                      
                      if (response.ok) {
                        toast({
                          title: "Task completed! 🎉",
                          description: `You earned $${activeTask.paymentAmount}!`,
                        });
                        setActiveTask(null);
                        setElapsedTime(0);
                        setShowCamera(false);
                        fetchAvailableChores();
                      } else {
                        toast({
                          title: "Error",
                          description: "Failed to complete task",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to complete task",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30"
                >
                  Skip Photo & Complete
                </Button>
              </div>
            </>
          ) : (
            <>
              <img src={photoData} alt="Task completion" className="w-full h-full object-contain" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPhotoData(null)}
                  className="flex-1 max-w-xs"
                >
                  Retake
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmitTask}
                  className="flex-1 max-w-xs"
                >
                  Submit & Earn ${activeTask?.paymentAmount}
                </Button>
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-indigo-600">
            Your Chores
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/kid/${kidId}/networth`)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Net Worth
          </Button>
        </div>
      </div>

      {/* Active Task Timer */}
      {activeTask && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Currently working on:</p>
                <h2 className="text-2xl font-bold">{activeTask.choreTitle}</h2>
                <p className="text-lg mt-1">Earning: ${activeTask.paymentAmount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-4xl font-mono font-bold">
                  <Clock className="w-8 h-8" />
                  {formatTime(elapsedTime)}
                </div>
                <Button
                  onClick={handleCompleteClick}
                  className="mt-4 bg-white text-indigo-600 hover:bg-gray-100"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Complete Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chores List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="text-lg">
              Daily ({groupedChores.daily.length})
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-lg">
              Weekly ({groupedChores.weekly.length})
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-lg">
              Monthly ({groupedChores.monthly.length})
            </TabsTrigger>
          </TabsList>

          {(["daily", "weekly", "monthly"] as const).map((freq) => (
            <TabsContent key={freq} value={freq} className="space-y-4">
              {groupedChores[freq].length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    No {freq} chores available right now.
                  </CardContent>
                </Card>
              ) : (
                groupedChores[freq].map((chore) => (
                  <Card
                    key={chore.id}
                    className={`shadow-md ${
                      !chore.isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{chore.title}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {chore.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            ${chore.paymentAmount}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {chore.choreType === "shared" ? "🏆 First come" : "👤 Your task"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {chore.completedToday ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-green-700 font-semibold">
                            Completed today! ✨
                          </p>
                        </div>
                      ) : !chore.isAvailable ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-gray-600">
                            Not available right now
                          </p>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleStartTask(chore)}
                          disabled={!!activeTask}
                          className="w-full text-lg py-6"
                          size="lg"
                        >
                          {activeTask ? "Finish current task first" : "READY - Start Timer"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
