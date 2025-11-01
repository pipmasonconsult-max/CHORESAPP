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
  choreDescription: string;
  paymentAmount: string;
  startTime: number;
}

export default function KidChoresPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const [chores, setChores] = useState<Chore[]>([]);
  const [kidName, setKidName] = useState<string>("");
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraView, setCameraView] = useState<'camera' | 'preview'>('camera'); // Track which view to show
  const [photoData, setPhotoData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const photoDataRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (kidId) {
      fetchKidInfo();
      fetchAvailableChores();
    }
  }, [kidId]);

  const fetchKidInfo = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}`);
      if (response.ok) {
        const kid = await response.json();
        setKidName(kid.name);
      }
    } catch (error) {
      console.error("Failed to fetch kid info:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTask) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - activeTask.startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask]);

  // Debug: Log photoData changes
  useEffect(() => {
    console.log("[DEBUG] photoData changed:", photoData ? "HAS_PHOTO" : "NO_PHOTO");
    console.log("[DEBUG] showCamera:", showCamera);
  }, [photoData, showCamera]);

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
          choreDescription: chore.description,
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
    setCameraView('camera'); // Reset to camera view
    
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

  const handleTakePhoto = async () => {
    console.log("[DEBUG] handleTakePhoto called");
    if (!videoRef.current || !canvasRef.current || !activeTask) return;
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
    // Capture photo at reduced resolution for faster upload
    const maxWidth = 1280; // Max width for photo
    const maxHeight = 720; // Max height for photo
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    // Calculate scaled dimensions maintaining aspect ratio
    let width = videoWidth;
    let height = videoHeight;
    if (width > maxWidth) {
      height = (maxWidth / width) * height;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (maxHeight / height) * width;
      height = maxHeight;
    }
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);
    const photo = canvasRef.current.toDataURL("image/jpeg", 0.7); // Compress to 70% quality
    console.log("[DEBUG] Photo captured, size:", photo.length, "bytes", `resolution: ${width}x${height}`);
    
    // Stop camera immediately
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    
    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Show loading toast
    toast({
      title: "Uploading photo...",
      description: "Please wait",
    });
    
    // Auto-complete task with photo
    try {
      console.log("[DEBUG] Sending completion request...");
      
      // Add timeout to prevent infinite freeze
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`/api/tasks/${activeTask.taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log("[DEBUG] Response status:", response.status);
      
      if (response.ok) {
        console.log("[DEBUG] Task completed successfully");
        toast({
          title: "Task completed! 🎉",
          description: `You earned $${activeTask.paymentAmount}!`,
        });
        
        // Reset all states
        setActiveTask(null);
        setElapsedTime(0);
        setShowCamera(false);
        setPhotoData(null);
        photoDataRef.current = null;
        setCameraView('camera');
        
        // Refresh chores list
        await fetchAvailableChores();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("[DEBUG] Completion failed:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to complete task",
          variant: "destructive",
        });
        
        // Close camera on error
        setShowCamera(false);
      }
    } catch (error) {
      console.error("[DEBUG] Exception during completion:", error);
      
      let errorMessage = "Failed to complete task";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Upload timed out. Please try again with better connection.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Close camera on error
      setShowCamera(false);
    }
  };

  const handleSubmitTask = async () => {
    const photo = photoData || photoDataRef.current;
    console.log("Submit task called", { activeTask, hasPhoto: !!photo });
    
    if (!activeTask || !photo) {
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
        body: JSON.stringify({ photo }),
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
        photoDataRef.current = null;
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

  // Time-based filtering
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const choreTimeMap: Record<string, string[]> = {
    'Make bed': ['morning'],
    'Brush teeth': ['morning', 'evening'],
    'Feed pets': ['morning', 'evening'],
    'Set the table': ['afternoon', 'evening'],
    'Clear the table': ['evening'],
    'Do homework': ['afternoon', 'evening'],
    'Take out trash': ['evening'],
    'Water plants': ['morning', 'afternoon'],
    'Tidy room': ['afternoon', 'evening'],
    'Put away toys': ['evening'],
  };

  const isChoreRelevantNow = (choreTitle: string) => {
    const timeOfDay = getTimeOfDay();
    const relevantTimes = choreTimeMap[choreTitle];
    if (!relevantTimes) return true; // Show custom chores always
    return relevantTimes.includes(timeOfDay);
  };

  const groupedChores = {
    daily: chores.filter((c) => c.frequency === "daily" && isChoreRelevantNow(c.title)),
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
              photoDataRef.current = null;
              setCameraView('camera'); // Reset view
            }}
            className="text-white hover:bg-white/20"
          >
            ✕ Cancel
          </Button>
          <h2 className="text-white font-semibold">Take Photo</h2>
          <div className="w-20"></div>
        </div>
        <div className="flex-1 relative overflow-hidden">
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
              className="rounded-full w-20 h-20 bg-white hover:bg-gray-100"
              onClick={handleTakePhoto}
            >
              <Camera className="w-10 h-10 text-indigo-600" />
            </Button>
            <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              Tap to capture & complete
            </p>
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

      {/* Full-Screen Active Task Timer */}
      {activeTask && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 z-50 flex flex-col">
          {/* Header with kid name and cancel */}
          <div className="p-6 flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90">Working hard!</p>
              <h1 className="text-3xl font-bold">{kidName}</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm("Are you sure you want to cancel this chore?")) {
                  // Stop music
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  setActiveTask(null);
                  setElapsedTime(0);
                  toast({
                    title: "Chore cancelled",
                    description: "You can start a different chore now",
                  });
                }
              }}
              className="text-white hover:bg-white/20 text-lg px-6"
            >
              ✕ Cancel Chore
            </Button>
          </div>

          {/* Main content - centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center text-white">
            {/* Timer */}
            <div className="mb-8">
              <Clock className="w-20 h-20 mx-auto mb-4 opacity-90" />
              <div className="text-8xl font-mono font-bold tracking-wider">
                {formatTime(elapsedTime)}
              </div>
            </div>

            {/* Chore info */}
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">{activeTask.choreTitle}</h2>
              <p className="text-xl opacity-90 mb-6">{activeTask.choreDescription}</p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full">
                <p className="text-2xl font-semibold">Earning: ${activeTask.paymentAmount}</p>
              </div>
            </div>

            {/* Complete button */}
            <Button
              onClick={handleCompleteClick}
              size="lg"
              className="mt-12 bg-white text-indigo-600 hover:bg-gray-100 text-2xl px-12 py-8 rounded-full shadow-2xl"
            >
              <Check className="w-8 h-8 mr-3" />
              Complete Task
            </Button>
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
                <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                {groupedChores[freq].map((chore, index) => (
                  <Card
                    key={chore.id}
                    className={`shadow-md snap-center shrink-0 w-[85vw] md:w-[400px] ${
                      !chore.isAvailable ? "opacity-50" : ""
                    } ${index === 0 ? 'ml-4' : ''} ${index === groupedChores[freq].length - 1 ? 'mr-4' : ''}`}
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
                ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
