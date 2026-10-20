import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  User,
  ChevronDown,
  FileText,
  MessageCircle,
  Play,
  BarChart3,
  Trophy,
  Star,
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  PlusCircle,
  ClipboardList,
  Brain,
  Lightbulb,
  Award,
  Clock,
  ArrowRight,
  Zap,
  BookMarked,
  UserCheck
} from 'lucide-react';

const Home = () => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  const features = [
    {
      icon: FileText,
      title: "Interactive Quizzes & Assignments",
      description: "Teachers create engaging quizzes while students take assessments with instant feedback",
      color: "orange"
    },
    {
      icon: BookMarked,
      title: "Digital Notes & Resources",
      description: "Comprehensive study materials and resources shared by teachers for enhanced learning",
      color: "green"
    },
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Personalized content suggestions based on student interests and learning patterns",
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Real-time analytics for both students and teachers to monitor academic performance",
      color: "pink"
    },
    {
      icon: MessageCircle,
      title: "AI Study Assistant",
      description: "24/7 intelligent chatbot to help students with questions and study guidance",
      color: "blue"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Interactive platform connecting students and teachers for better educational outcomes",
      color: "indigo"
    }
  ];

  const studentFeatures = [
    { icon: Trophy, text: "Take interactive quizzes and assignments" },
    { icon: Play, text: "Access personalized video recommendations" },
    { icon: MessageCircle, text: "Chat with AI study assistant" },
    { icon: BarChart3, text: "Track your learning progress" },
    { icon: Star, text: "Get recommendations based on your interests" },
    { icon: BookOpen, text: "Access comprehensive study materials" }
  ];

  const teacherFeatures = [
    { icon: PlusCircle, text: "Create and manage quizzes & assignments" },
    { icon: ClipboardList, text: "Review student submissions and scores" },
    { icon: BookMarked, text: "Share notes and educational resources" },
    { icon: BarChart3, text: "Monitor student progress and analytics" },
    { icon: UserCheck, text: "Track individual student performance" },
    { icon: Target, text: "Set learning goals and milestones" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">EduTrack</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">Login</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showLoginDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <Link 
                    to="/student" 
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-800">Student Login</span>
                  </Link>
                  <Link 
                    to="/teacher" 
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-gray-800">Teacher Login</span>
                  </Link>
                  <Link 
                    to="/admin" 
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-800">Admin Login</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to EduTrack 🎓
            </h1>
            <p className="text-xl opacity-90 mb-6">
              A comprehensive educational platform connecting students and teachers for enhanced learning experiences
            </p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-80">
              <Zap className="w-4 h-4" />
              <span>AI-Powered • Interactive • Personalized</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Students</h3>
              <p className="text-gray-600">Take quizzes, track progress, and get personalized recommendations</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
              <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Teachers</h3>
              <p className="text-gray-600">Create content, manage assignments, and monitor student progress</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Admins</h3>
              <p className="text-gray-600">Oversee platform operations and manage user accounts</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border border-${feature.color}-100 hover:shadow-xl transition-shadow`}>
                <div className={`bg-${feature.color}-100 p-3 rounded-lg w-fit mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Student Dashboard Preview */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Student Dashboard</h2>
                <p className="text-lg opacity-90 mb-6">
                  Comprehensive learning hub designed for students to excel in their academic journey
                </p>
                <div className="space-y-3">
                  {studentFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5" />
                      <span className="opacity-90">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/student" 
                  className="inline-flex items-center gap-2 mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Get Started as Student
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">Quiz Performance</span>
                    </div>
                    <div className="text-2xl font-bold">87% Average</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5" />
                      <span className="font-medium">AI Recommendations</span>
                    </div>
                    <div className="text-sm opacity-90">5 new suggestions available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teacher Dashboard Preview */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <ClipboardList className="w-5 h-5" />
                      <span className="font-medium">Active Quizzes</span>
                    </div>
                    <div className="text-2xl font-bold">12 Running</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Student Submissions</span>
                    </div>
                    <div className="text-sm opacity-90">248 submissions to review</div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Teacher Dashboard</h2>
                <p className="text-lg opacity-90 mb-6">
                  Powerful tools for educators to create, manage, and track student progress effectively
                </p>
                <div className="space-y-3">
                  {teacherFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5" />
                      <span className="opacity-90">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/teacher" 
                  className="inline-flex items-center gap-2 mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Get Started as Teacher
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Why Choose EduTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6" />
                <h3 className="text-xl font-bold">Smart Learning</h3>
              </div>
              <p className="opacity-90">
                AI-powered recommendations and personalized learning paths help students learn more effectively based on their unique patterns and interests.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-bold">Track Progress</h3>
              </div>
              <p className="opacity-90">
                Comprehensive analytics for both students and teachers to monitor academic progress and identify areas for improvement.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">24/7 Support</h3>
              </div>
              <p className="opacity-90">
                AI chatbot provides round-the-clock assistance for students, helping with questions and providing study guidance anytime.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Better Outcomes</h3>
              </div>
              <p className="opacity-90">
                Interactive quizzes, personalized content, and real-time feedback contribute to improved learning outcomes and academic success.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Learning?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of students and teachers already using EduTrack to achieve their educational goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/student" 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                <User className="w-4 h-4" />
                Start as Student
              </Link>
              <Link 
                to="/teacher" 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                Start as Teacher
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">EduTrack</span>
          </div>
          <p className="text-center text-gray-600">
            Empowering education through technology • Making learning accessible and engaging for everyone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;