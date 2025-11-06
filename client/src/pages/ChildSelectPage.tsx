import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Kid {
  id: number;
  name: string;
  avatarColor: string;
  earnings: number;
}

export default function ChildSelectPage() {
  const navigate = useNavigate();
  const [kids, setKids] = useState<Kid[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/kids");
      if (response.ok) {
        const data = await response.json();
        setKids(data);
      } else {
        toast.error("Failed to load kids");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to load kids");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < kids.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectKid = () => {
    const kid = kids[currentIndex];
    navigate(`/kid/${kid.id}/chores`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (kids.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Kids Found</h2>
          <p className="text-gray-600 mb-8">Ask your parent to set up your profile first!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentKid = kids[currentIndex];

  return (
    <div
      className="h-screen w-screen flex flex-col relative overflow-hidden fixed inset-0"
      style={{ backgroundColor: currentKid.avatarColor }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
      >
        ← Back
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {currentIndex < kids.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Avatar Circle */}
        <div className="w-48 h-48 mb-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-8 border-white/50">
          <span className="text-8xl font-bold text-white">
            {currentKid.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Kid Name */}
        <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg">
          {currentKid.name}
        </h1>

        {/* Earnings */}
        <div className="mb-12 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl">
          <p className="text-2xl text-white/90 mb-1">Current Earnings</p>
          <p className="text-5xl font-bold text-white">${(currentKid.earnings || 0).toFixed(2)}</p>
        </div>

        {/* Start Chores Button */}
        <button
          onClick={handleSelectKid}
          className="px-16 py-6 bg-white text-gray-900 rounded-2xl text-3xl font-bold hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl"
        >
          Start Chores
        </button>

        {/* Page Indicators */}
        <div className="flex gap-3 mt-12">
          {kids.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      {kids.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/70 text-lg">
            ← Swipe to see other kids →
          </p>
        </div>
      )}
    </div>
  );
}
