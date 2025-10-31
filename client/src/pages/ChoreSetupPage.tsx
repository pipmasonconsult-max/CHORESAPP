import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Chore {
  id: number;
  title: string;
  description: string;
  paymentAmount: string;
  frequency: "daily" | "weekly" | "monthly";
  choreType: "shared" | "individual";
  isPrePopulated: boolean;
}

interface Kid {
  id: number;
  name: string;
  avatarColor: string;
}

export default function ChoreSetupPage() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChores, setSelectedChores] = useState<Set<number>>(new Set());
  const [assignmentMode, setAssignmentMode] = useState<"all" | "specific">("all");
  const [selectedKids, setSelectedKids] = useState<Set<number>>(new Set());
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchChores();
    fetchKids();
  }, []);

  const fetchChores = async () => {
    try {
      const response = await fetch("/api/chores");
      if (response.ok) {
        const data = await response.json();
        setChores(data);
      }
    } catch (error) {
      console.error("Failed to fetch chores:", error);
    }
  };

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

  const toggleChoreSelection = (choreId: number) => {
    const newSelected = new Set(selectedChores);
    if (newSelected.has(choreId)) {
      newSelected.delete(choreId);
    } else {
      newSelected.add(choreId);
    }
    setSelectedChores(newSelected);
  };

  const toggleKidSelection = (kidId: number) => {
    const newSelected = new Set(selectedKids);
    if (newSelected.has(kidId)) {
      newSelected.delete(kidId);
    } else {
      newSelected.add(kidId);
    }
    setSelectedKids(newSelected);
  };

  const handleAssignChores = async () => {
    if (selectedChores.size === 0) {
      toast({
        title: "No chores selected",
        description: "Please select at least one chore to assign.",
        variant: "destructive",
      });
      return;
    }

    if (assignmentMode === "specific" && selectedKids.size === 0) {
      toast({
        title: "No kids selected",
        description: "Please select at least one kid to assign chores to.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const choreId of Array.from(selectedChores)) {
        const response = await fetch(`/api/chores/${choreId}/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignToAll: assignmentMode === "all",
            kidId: assignmentMode === "specific" ? Array.from(selectedKids)[0] : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to assign chore");
        }

        // If assigning to specific kids, assign to each selected kid
        if (assignmentMode === "specific") {
          for (const kidId of Array.from(selectedKids)) {
            if (kidId !== Array.from(selectedKids)[0]) {
              await fetch(`/api/chores/${choreId}/assign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kidId }),
              });
            }
          }
        }
      }

      toast({
        title: "Chores assigned!",
        description: `${selectedChores.size} chore(s) have been assigned successfully.`,
      });

      setSelectedChores(new Set());
      setSelectedKids(new Set());
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign chores",
        variant: "destructive",
      });
    }
  };

  const filteredChores = chores.filter((chore) => {
    const matchesSearch = chore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chore.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrequency = filterFrequency === "all" || chore.frequency === filterFrequency;
    return matchesSearch && matchesFrequency;
  });

  const groupedChores = {
    daily: filteredChores.filter((c) => c.frequency === "daily"),
    weekly: filteredChores.filter((c) => c.frequency === "weekly"),
    monthly: filteredChores.filter((c) => c.frequency === "monthly"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            Select Chores
          </h1>
          <p className="text-lg text-gray-600">
            Choose from 50+ pre-populated chores or create your own
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chore Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Chores</CardTitle>
                    <CardDescription>
                      {selectedChores.size} chore(s) selected
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search chores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-lg p-5"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="daily" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">Daily ({groupedChores.daily.length})</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly ({groupedChores.weekly.length})</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly ({groupedChores.monthly.length})</TabsTrigger>
                  </TabsList>

                  {(["daily", "weekly", "monthly"] as const).map((freq) => (
                    <TabsContent key={freq} value={freq} className="space-y-2 max-h-96 overflow-y-auto">
                      {groupedChores[freq].map((chore) => (
                        <div
                          key={chore.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedChores.has(chore.id)
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300"
                          }`}
                          onClick={() => toggleChoreSelection(chore.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{chore.title}</h3>
                                {selectedChores.has(chore.id) && (
                                  <Check className="w-5 h-5 text-indigo-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{chore.description}</p>
                              <div className="flex gap-3 mt-2">
                                <span className="text-sm font-medium text-green-600">
                                  ${chore.paymentAmount}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {chore.choreType === "shared" ? "🏆 First come" : "👤 Individual"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Assignment Panel */}
          <div className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Assign To</CardTitle>
                <CardDescription>
                  Choose who can do these chores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      assignmentMode === "all"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setAssignmentMode("all")}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={assignmentMode === "all"} />
                      <div>
                        <p className="font-semibold">All Kids</p>
                        <p className="text-sm text-gray-600">
                          Assign to everyone
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      assignmentMode === "specific"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setAssignmentMode("specific")}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={assignmentMode === "specific"} />
                      <div>
                        <p className="font-semibold">Specific Kids</p>
                        <p className="text-sm text-gray-600">
                          Choose who can do these
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {assignmentMode === "specific" && (
                  <div className="space-y-2 mt-4">
                    <Label>Select Kids</Label>
                    {kids.map((kid) => (
                      <div
                        key={kid.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedKids.has(kid.id)
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                        onClick={() => toggleKidSelection(kid.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: kid.avatarColor }}
                          >
                            {kid.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{kid.name}</span>
                          {selectedKids.has(kid.id) && (
                            <Check className="w-5 h-5 text-indigo-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleAssignChores}
                  className="w-full text-lg py-6 mt-6"
                  size="lg"
                  disabled={selectedChores.size === 0}
                >
                  Assign {selectedChores.size} Chore(s) →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
