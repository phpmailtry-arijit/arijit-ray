
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import Analytics from "./pages/admin/Analytics";
import AdminProfile from "./pages/admin/AdminProfile";
import ExperienceManagement from "./pages/admin/ExperienceManagement";
import BlogGenerationSettings from "./pages/admin/BlogGenerationSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Index />} />
            <Route path="/achievements" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
              <Route path="experience" element={<ExperienceManagement />} />
              <Route path="blog-generation" element={<BlogGenerationSettings />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
