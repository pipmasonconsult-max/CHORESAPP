import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Kid {
  id: number;
  name: string;
  birthday: string;
  pocketMoneyAmount: string;
  pocketMoneyFrequency: string;
  avatarColor: string;
}

interface Chore {
  id: number;
  title: string;
  description: string;
  paymentAmount: string;
  frequency: string;
  choreType: string;
}

interface CompletedTask {
  id: number;
  kidName: string;
  choreTitle: string;
  completedAt: string;
  photoUrl: string | null;
  amountEarned: number;
}

export default function ParentManagementPage() {
  const navigate = useNavigate();
  const [kids, setKids] = useState<Kid[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [pendingTasks, setPendingTasks] = useState<CompletedTask[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCustomChoreDialogOpen, setIsCustomChoreDialogOpen] = useState(false);
  const [customChore, setCustomChore] = useState({
    title: "",
    description: "",
    paymentAmount: "",
    frequency: "daily" as "daily" | "weekly" | "monthly",
    choreType: "individual" as "shared" | "individual",
  });

  useEffect(() => {
    fetchKids();
    fetchChores();
    fetchCompletedTasks();
    fetchPendingTasks();
  }, []);

  const fetchPendingTasks = async () => {
    try {
      const response = await fetch("/api/tasks/pending");
      if (response.ok) {
        const data = await response.json();
        setPendingTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch pending tasks:", error);
    }
  };

  const handleApproveTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/approve`, { method: "POST" });
      if (response.ok) {
        toast.success("Task approved!");
        fetchPendingTasks();
        fetchCompletedTasks();
      } else {
        toast.error("Failed to approve task");
      }
    } catch (error) {
      toast.error("Failed to approve task");
    }
  };

  const handleRejectTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to reject this task? It will be deleted.")) return;
    try {
      const response = await fetch(`/api/tasks/${taskId}/reject`, { method: "POST" });
      if (response.ok) {
        toast.success("Task rejected");
        fetchPendingTasks();
      } else {
        toast.error("Failed to reject task");
      }
    } catch (error) {
      toast.error("Failed to reject task");
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

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch("/api/tasks/completed-with-photos");
      if (response.ok) {
        const data = await response.json();
        setCompletedTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch completed tasks:", error);
    }
  };

  const handleDeleteKid = async (kidId: number) => {
    if (!confirm("Are you sure you want to delete this kid profile?")) return;
    
    try {
      const response = await fetch(`/api/kids/${kidId}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Kid profile deleted");
        fetchKids();
      } else {
        toast.error("Failed to delete kid profile");
      }
    } catch (error) {
      toast.error("Failed to delete kid profile");
    }
  };

  const handleDeleteChore = async (choreId: number) => {
    if (!confirm("Are you sure you want to delete this chore?")) return;
    
    try {
      const response = await fetch(`/api/chores/${choreId}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Chore deleted");
        fetchChores();
      } else {
        toast.error("Failed to delete chore");
      }
    } catch (error) {
      toast.error("Failed to delete chore");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-12 w-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Management</h1>
            <p className="text-gray-600">Manage kids, chores, and view completed tasks</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="pending">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="kids">Kids</TabsTrigger>
            <TabsTrigger value="chores">Chores</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Pending Approval Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Pending Approval</CardTitle>
                <CardDescription>Review and approve completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No tasks pending approval</p>
                    </div>
                  ) : (
                    pendingTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4 flex items-start gap-4">
                        {task.photoUrl && (
                          <img
                            src={task.photoUrl}
                            alt={task.choreTitle}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{task.choreTitle}</h3>
                          <p className="text-sm text-gray-600">
                            {task.kidName} • {new Date(task.completedAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Earning: ${Number(task.amountEarned).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveTask(task.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectTask(task.id)}
                          >
                            ✕ Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kids Tab */}
          <TabsContent value="kids">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Kids</CardTitle>
                    <CardDescription>Add, edit, or remove kid profiles</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/setup")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Kid
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kids.map((kid) => (
                    <div
                      key={kid.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: kid.avatarColor }}
                        >
                          {kid.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{kid.name}</div>
                          <div className="text-sm text-gray-600">
                            ${kid.pocketMoneyAmount} {kid.pocketMoneyFrequency}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedKid(kid);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteKid(kid.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {kids.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No kids added yet. Click "Add Kid" to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chores Tab */}
          <TabsContent value="chores">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Chores</CardTitle>
                    <CardDescription>View and manage available chores</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsCustomChoreDialogOpen(true)} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Custom Chore
                    </Button>
                    <Button onClick={() => navigate("/chores")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Assign Chores
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chores.map((chore) => (
                    <div
                      key={chore.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{chore.title}</div>
                        <div className="text-sm text-gray-600">{chore.description}</div>
                        <div className="text-sm text-green-600 font-medium mt-1">
                          ${chore.paymentAmount} • {chore.frequency}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteChore(chore.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {chores.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No chores available. Go to Chore Setup to add chores.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Gallery Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks Photo Gallery</CardTitle>
                <CardDescription>View photos from completed chores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks
                    .filter((task) => task.photoUrl)
                    .map((task) => (
                      <div key={task.id} className="border rounded-lg overflow-hidden">
                        <img
                          src={task.photoUrl!}
                          alt={task.choreTitle}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <div className="font-semibold text-sm">{task.choreTitle}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {task.kidName} • {new Date(task.completedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-green-600 font-medium mt-1">
                            +${task.amountEarned.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  {completedTasks.filter((task) => task.photoUrl).length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No photos yet!</p>
                      <p className="text-sm mt-2">Photos from completed tasks will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/settings")}
                >
                  Change Password
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Custom Chore Creation Dialog */}
        <Dialog open={isCustomChoreDialogOpen} onOpenChange={setIsCustomChoreDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Chore</DialogTitle>
              <DialogDescription>
                Add a new custom chore with your own title, description, and payment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="chore-title">Chore Title</Label>
                <Input
                  id="chore-title"
                  value={customChore.title}
                  onChange={(e) => setCustomChore({ ...customChore, title: e.target.value })}
                  placeholder="e.g., Organize garage"
                />
              </div>
              <div>
                <Label htmlFor="chore-description">Description</Label>
                <Input
                  id="chore-description"
                  value={customChore.description}
                  onChange={(e) => setCustomChore({ ...customChore, description: e.target.value })}
                  placeholder="e.g., Clean and organize tools"
                />
              </div>
              <div>
                <Label htmlFor="chore-payment">Payment Amount ($)</Label>
                <Input
                  id="chore-payment"
                  type="number"
                  step="0.01"
                  value={customChore.paymentAmount}
                  onChange={(e) => setCustomChore({ ...customChore, paymentAmount: e.target.value })}
                  placeholder="5.00"
                />
              </div>
              <div>
                <Label htmlFor="chore-frequency">Frequency</Label>
                <select
                  id="chore-frequency"
                  value={customChore.frequency}
                  onChange={(e) => setCustomChore({ ...customChore, frequency: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <Label htmlFor="chore-type">Chore Type</Label>
                <select
                  id="chore-type"
                  value={customChore.choreType}
                  onChange={(e) => setCustomChore({ ...customChore, choreType: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="individual">Individual (assign to specific kids)</option>
                  <option value="shared">Shared (all kids can do)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCustomChoreDialogOpen(false);
                    setCustomChore({
                      title: "",
                      description: "",
                      paymentAmount: "",
                      frequency: "daily",
                      choreType: "individual",
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!customChore.title || !customChore.paymentAmount) {
                      toast.error("Please fill in title and payment amount");
                      return;
                    }
                    try {
                      const response = await fetch("/api/chores", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(customChore),
                      });
                      if (response.ok) {
                        toast.success("Custom chore created!");
                        setIsCustomChoreDialogOpen(false);
                        setCustomChore({
                          title: "",
                          description: "",
                          paymentAmount: "",
                          frequency: "daily",
                          choreType: "individual",
                        });
                        fetchChores();
                      } else {
                        toast.error("Failed to create chore");
                      }
                    } catch (error) {
                      toast.error("Failed to create chore");
                    }
                  }}
                  className="flex-1"
                >
                  Create Chore
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
