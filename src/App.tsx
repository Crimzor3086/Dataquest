import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import VisitorTracker from "@/components/VisitorTracker";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import GA4Tracker from "@/components/GA4Tracker";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseRegistration from "./pages/CourseRegistration";
import Team from "./pages/Team";
import Contacts from "./pages/Contacts";
import Blog from "./pages/Blog";
import DiabetesCaseStudy from "./pages/DiabetesCaseStudy";
import StrokeCaseStudy from "./pages/StrokeCaseStudy";
import FAQs from "./pages/FAQs";
import Resources from "./pages/Resources";
import Consultation from "./pages/Consultation";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import CaseStudies from "./pages/CaseStudies";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import CourseManagement from "./pages/CourseManagement";
import StudentManagement from "./pages/StudentManagement";
import ClientManagement from "./pages/ClientManagement";
import SystemSettings from "./pages/SystemSettings";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import WebDevelopment from "./pages/WebDevelopment";
import GraphicDesign from "./pages/GraphicDesign";
import Webinars from "./pages/Webinars";
import Sitemap from "./pages/Sitemap";
import InstructorsPage from "./pages/Instructors";
import PaymentDashboard from "./pages/PaymentDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import BlogManagement from "./pages/BlogManagement";
import ResourceManagement from "./pages/ResourceManagement";
import WebinarManagement from "./pages/WebinarManagement";
import PaymentForm from '@/components/PaymentForm';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import BlogPost from './pages/BlogPost';
import PaymentTesting from './pages/PaymentTesting';
import PaymentAudit from './pages/PaymentAudit';
import Profile from './pages/Profile';

// Create QueryClient outside component to avoid recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <VisitorTracker />
              <GA4Tracker />
              <ChatbaseWidget />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/courses/:id/register" element={<CourseRegistration />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/diabetes-case-study" element={<DiabetesCaseStudy />} />
                <Route path="/blog/stroke-case-study" element={<StrokeCaseStudy />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/software-development" element={<SoftwareDevelopment />} />
                <Route path="/web-development" element={<WebDevelopment />} />
                <Route path="/graphic-design" element={<GraphicDesign />} />
                <Route path="/webinars" element={<Webinars />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                
                {/* Payment Routes */}
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                
                {/* Protected Admin Routes - Exclusive Access for enochosenwafulah@gmail.com */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute adminOnly={true}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin/courses" element={
                  <ProtectedRoute adminOnly={true}>
                    <CourseManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/students" element={
                  <ProtectedRoute adminOnly={true}>
                    <StudentManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/clients" element={
                  <ProtectedRoute adminOnly={true}>
                    <ClientManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/payments" element={
                  <ProtectedRoute adminOnly={true}>
                    <PaymentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute adminOnly={true}>
                    <SystemSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/instructors" element={
                  <ProtectedRoute adminOnly={true}>
                    <InstructorsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog" element={
                  <ProtectedRoute adminOnly={true}>
                    <BlogManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/resources" element={
                  <ProtectedRoute adminOnly={true}>
                    <ResourceManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/webinars" element={
                  <ProtectedRoute adminOnly={true}>
                    <WebinarManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
