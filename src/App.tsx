import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import Analytics from "./pages/admin/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with navbar */}
          <Route path="/" element={<><Navbar /><Index /></>} />
          <Route path="/about" element={<><Navbar /><About /></>} />
          <Route path="/projects" element={<><Navbar /><Projects /></>} />
          <Route path="/blog" element={<><Navbar /><Blog /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /></>} />
          
          {/* Admin routes without navbar */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
