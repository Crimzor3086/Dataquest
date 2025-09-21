import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogManagementEnhanced from '@/components/blog/BlogManagementEnhanced';

const BlogManagement = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <BlogManagementEnhanced />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogManagement;