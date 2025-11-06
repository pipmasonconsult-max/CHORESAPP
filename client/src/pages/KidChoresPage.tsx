import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, DollarSign, Clock, X } from "lucide-react";
import { toast } from "sonner";

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

interface Kid {
  id: number;
  name: string;
  avatarColor: string;
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
  const navigate = useNavigate();
  const [kid, setKid] = useState<Kid | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [currentChoreIndex, setCurrentChoreIndex] = useState(0);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<"all" | "daily" | "weekly" | "monthly">("all");

  useEffect(() => {
    if (kidId) {
      fetchKidInfo();
      fetchAvailableChores();
    }
  }, [kidId]);

  // Timer for active task
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTask) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeTask.startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask]);

  const fetchKidInfo = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}`);
      if (response.ok) {
        const data = await response.json();
        setKid(data);
      }
    } catch (error) {
      console.error("Failed to fetch kid info:", error);
    }
  };

  const fetchAvailableChores = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}/available-chores`);
      if (response.ok) {
        const data = await response.json();
        // Filter chores by time of day
        const filtered = filterChoresByTime(data);
        setChores(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch chores:", error);
      toast.error("Failed to load chores");
    } finally {
      setIsLoading(false);
    }
  };

  const filterChoresByTime = (allChores: Chore[]) => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    const timeBasedChores: Record<string, string[]> = {
      morning: ["Make Bed", "Brush Teeth", "Get Dressed", "Eat Breakfast"],
      afternoon: ["Do Homework", "Practice Instrument", "Clean Room"],
      evening: ["Set Table", "Clear Table", "Take Bath", "Brush Teeth"],
    };

    const relevantTitles = timeBasedChores[timeOfDay] || [];
    
    return allChores.filter(chore => 
      relevantTitles.some(title => chore.title.includes(title)) || 
      chore.choreType === "individual" // Always show custom chores
    );
  };

  const handleNext = () => {
    const filteredChores = frequencyFilter === "all" 
      ? chores 
      : chores.filter(chore => chore.frequency === frequencyFilter);
    if (currentChoreIndex < filteredChores.length - 1) {
      setCurrentChoreIndex(currentChoreIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentChoreIndex > 0) {
      setCurrentChoreIndex(currentChoreIndex - 1);
    }
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleStartChore = async () => {
    const chore = chores[currentChoreIndex];
    try {
      const response = await fetch(`/api/kids/${kidId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choreId: chore.id }),
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
        toast.success("Chore started!");
      } else {
        toast.error("Failed to start chore");
      }
    } catch (error) {
      console.error("Failed to start chore:", error);
      toast.error("Failed to start chore");
    }
  };

  const handleCancelTask = () => {
    setActiveTask(null);
    setElapsedTime(0);
    toast.info("Chore cancelled");
  };

  const handleCompleteTask = async () => {
    if (!activeTask) return;

    try {
      const response = await fetch(`/api/kids/${kidId}/tasks/${activeTask.taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeToComplete: elapsedTime,
        }),
      });

      if (response.ok) {
        toast.success("Chore completed! Waiting for parent approval.");
        setActiveTask(null);
        setElapsedTime(0);
        fetchAvailableChores();
      } else {
        toast.error("Failed to complete chore");
      }
    } catch (error) {
      console.error("Failed to complete chore:", error);
      toast.error("Failed to complete chore");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Active Task Full-Screen Timer
  if (activeTask) {
    return (
      <div
        className="min-h-screen flex flex-col relative"
        style={{ backgroundColor: kid?.avatarColor || "#6366f1" }}
      >
        {/* Cancel Button */}
        <button
          onClick={handleCancelTask}
          className="absolute top-4 right-4 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          {/* Kid Name */}
          <h2 className="text-3xl font-bold text-white/90 mb-8">{kid?.name}</h2>

          {/* Chore Title */}
          <h1 className="text-5xl font-bold text-white mb-6">{activeTask.choreTitle}</h1>

          {/* Timer */}
          <div className="mb-12 bg-white/20 backdrop-blur-sm px-16 py-8 rounded-3xl">
            <p className="text-2xl text-white/90 mb-2">Time Elapsed</p>
            <p className="text-8xl font-bold text-white font-mono">{formatTime(elapsedTime)}</p>
          </div>

          {/* Payment Amount */}
          <div className="mb-12 flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl">
            <DollarSign className="w-8 h-8 text-white" />
            <span className="text-4xl font-bold text-white">${activeTask.paymentAmount}</span>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleCompleteTask}
            className="px-16 py-6 bg-white text-gray-900 rounded-2xl text-3xl font-bold hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl"
          >
            Mark Complete
          </button>

          <p className="mt-8 text-white/70 text-lg">
            Finish your chore and click "Mark Complete"
          </p>
        </div>
      </div>
    );
  }

  // No chores available
  if (chores.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <button
          onClick={() => navigate("/child-select")}
          className="absolute top-4 left-4 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Chores Available</h2>
          <p className="text-gray-600 mb-8">Check back later for more chores!</p>
        </div>
      </div>
    );
  }

  // Filter chores by frequency
  const filteredChores = frequencyFilter === "all" 
    ? chores 
    : chores.filter(chore => chore.frequency === frequencyFilter);
  
  const currentChore = filteredChores[currentChoreIndex];

  // Full-Screen Chore Cards
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: kid?.avatarColor || "#6366f1" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/child-select")}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
      >
        ← Back
      </button>
      
      {/* Frequency Filter Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => { setFrequencyFilter("all"); setCurrentChoreIndex(0); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            frequencyFilter === "all" 
              ? "bg-white text-gray-900" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}
        >
          All
        </button>
        <button
          onClick={() => { setFrequencyFilter("daily"); setCurrentChoreIndex(0); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            frequencyFilter === "daily" 
              ? "bg-white text-gray-900" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => { setFrequencyFilter("weekly"); setCurrentChoreIndex(0); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            frequencyFilter === "weekly" 
              ? "bg-white text-gray-900" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => { setFrequencyFilter("monthly"); setCurrentChoreIndex(0); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            frequencyFilter === "monthly" 
              ? "bg-white text-gray-900" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Navigation Arrows */}
      {currentChoreIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {currentChoreIndex < filteredChores.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Kid Name */}
        <h2 className="text-3xl font-bold text-white/90 mb-8">{kid?.name}'s Chores</h2>

        {/* Chore Title */}
        <h1 className="text-6xl font-bold text-white mb-8">{currentChore.title}</h1>

        {/* Chore Description */}
        <div className="mb-8 bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl max-w-2xl">
          <p className="text-2xl text-white leading-relaxed">{currentChore.description}</p>
        </div>

        {/* Payment & Frequency */}
        <div className="flex gap-6 mb-12">
          <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <div className="text-left">
              <p className="text-sm text-white/70">Earn</p>
              <p className="text-3xl font-bold text-white">${currentChore.paymentAmount}</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl flex items-center gap-3">
            <Clock className="w-8 h-8 text-white" />
            <div className="text-left">
              <p className="text-sm text-white/70">Frequency</p>
              <p className="text-2xl font-bold text-white capitalize">{currentChore.frequency}</p>
            </div>
          </div>
        </div>

        {/* Start Chore Button */}
        <button
          onClick={handleStartChore}
          disabled={currentChore.completedToday}
          className="px-16 py-6 bg-white text-gray-900 rounded-2xl text-3xl font-bold hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentChore.completedToday ? "Completed Today" : "Start Chore"}
        </button>

        {/* Page Indicators */}
        <div className="flex gap-3 mt-12">
          {chores.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentChoreIndex ? "bg-white w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      {chores.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/70 text-lg">← Swipe to see more chores →</p>
        </div>
      )}
    </div>
  );
}
