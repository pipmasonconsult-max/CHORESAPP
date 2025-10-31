import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Kid {
  id?: number;
  name: string;
  birthday: string;
  pocketMoneyAmount: number;
  pocketMoneyFrequency: "daily" | "weekly" | "monthly";
  avatarColor: string;
}

const AVATAR_COLORS = [
  "#4F46E5", // Indigo
  "#EC4899", // Pink
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#14B8A6", // Teal
];

export default function SetupPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [newKid, setNewKid] = useState<Kid>({
    name: "",
    birthday: "",
    pocketMoneyAmount: 10,
    pocketMoneyFrequency: "weekly",
    avatarColor: AVATAR_COLORS[0],
  });
  const [isLoading, setIsLoading] = useState(false);
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
      }
    } catch (error) {
      console.error("Failed to fetch kids:", error);
    }
  };

  const handleAddKid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKid),
      });

      if (response.ok) {
        toast({
          title: "Kid profile created!",
          description: `${newKid.name}'s profile has been added.`,
        });
        
        // Reset form
        setNewKid({
          name: "",
          birthday: "",
          pocketMoneyAmount: 10,
          pocketMoneyFrequency: "weekly",
          avatarColor: AVATAR_COLORS[kids.length % AVATAR_COLORS.length],
        });
        
        fetchKids();
      } else {
        const data = await response.json();
        toast({
          title: "Failed to create profile",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKid = async (kidId: number) => {
    try {
      const response = await fetch(`/api/kids/${kidId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Profile deleted",
          description: "Kid profile has been removed.",
        });
        fetchKids();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    if (kids.length === 0) {
      toast({
        title: "Add at least one kid",
        description: "Please create at least one kid profile to continue.",
        variant: "destructive",
      });
      return;
    }
    navigate("/chores");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            Setup Kid Profiles
          </h1>
          <p className="text-lg text-gray-600">
            Add your children's information to get started
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Kid Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Add New Kid</CardTitle>
              <CardDescription>
                Enter your child's details and pocket money settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddKid} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Child's name"
                    value={newKid.name}
                    onChange={(e) => setNewKid({ ...newKid, name: e.target.value })}
                    required
                    className="text-lg p-5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={newKid.birthday}
                    onChange={(e) => setNewKid({ ...newKid, birthday: e.target.value })}
                    required
                    className="text-lg p-5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Pocket Money Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.5"
                    value={newKid.pocketMoneyAmount}
                    onChange={(e) => setNewKid({ ...newKid, pocketMoneyAmount: parseFloat(e.target.value) })}
                    required
                    className="text-lg p-5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Payment Frequency</Label>
                  <Select
                    value={newKid.pocketMoneyFrequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly") =>
                      setNewKid({ ...newKid, pocketMoneyFrequency: value })
                    }
                  >
                    <SelectTrigger className="text-lg p-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Avatar Color</Label>
                  <div className="flex gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full border-4 ${
                          newKid.avatarColor === color ? "border-gray-800" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewKid({ ...newKid, avatarColor: color })}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Kid"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Kids List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Kids ({kids.length})
            </h2>
            
            {kids.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    No kids added yet. Add your first kid to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {kids.map((kid) => (
                  <Card key={kid.id} className="shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                            style={{ backgroundColor: kid.avatarColor }}
                          >
                            {kid.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{kid.name}</h3>
                            <p className="text-sm text-gray-600">
                              ${kid.pocketMoneyAmount} {kid.pocketMoneyFrequency}
                            </p>
                            <p className="text-xs text-gray-500">
                              Born: {new Date(kid.birthday).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => kid.id && handleDeleteKid(kid.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {kids.length > 0 && (
              <Button
                onClick={handleContinue}
                className="w-full text-lg py-6 mt-6"
                size="lg"
              >
                Continue to Chore Setup →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
