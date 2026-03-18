import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute, VendorProtectedRoute } from "@/auth/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import AIStylistPage from "./pages/AIStylistPage";
import OOTWPage from "./pages/OOTWPage";
import VendorPage from "./pages/VendorPage";
import VendorLoginPage from "./pages/VendorLoginPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import Auth from "./pages/Auth";
import PlansPage from "./pages/PlansPage";
import StyleSurveyPage from "./pages/StyleSurveyPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import FAQChatbot from "./components/FAQChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/virtual-tryon" element={<VirtualTryOnPage />} />
            <Route path="/ai-stylist" element={<AIStylistPage />} />
            <Route path="/ootw" element={<OOTWPage />} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage />} />
            <Route
              path="/vendor/dashboard"
              element={
                <VendorProtectedRoute>
                  <VendorDashboardPage />
                </VendorProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/style-survey" element={<StyleSurveyPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FAQChatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
