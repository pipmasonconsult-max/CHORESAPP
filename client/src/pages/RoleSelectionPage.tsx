import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Baby } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-indigo-600 mb-4">{APP_TITLE}</h1>
          <p className="text-xl text-gray-700">
            Teach kids responsibility while earning their pocket money
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Parent Card */}
          <Card 
            className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-indigo-200"
          >
            <CardContent className="p-12 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-20 h-20 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Parent</h2>
              <p className="text-lg text-gray-600 mb-8">
                Manage chores, approve tasks, and track your children's progress
              </p>
              <Button 
                size="lg" 
                className="w-full text-xl py-6 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/parent-login")}
              >
                I'm a Parent
              </Button>
            </CardContent>
          </Card>

          {/* Child Card */}
          <Card 
            className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-pink-200"
          >
            <CardContent className="p-12 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                <Baby className="w-20 h-20 text-pink-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Child</h2>
              <p className="text-lg text-gray-600 mb-8">
                Complete chores, earn money, and track your savings
              </p>
              <Button 
                size="lg" 
                className="w-full text-xl py-6 bg-pink-600 hover:bg-pink-700"
                onClick={() => navigate("/child-select")}
              >
                I'm a Child
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center mt-8 text-gray-600">
          A fun way for kids to learn about money management and responsibility
        </p>
      </div>
    </div>
  );
}
