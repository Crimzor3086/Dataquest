
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
            <p className="text-gray-400">Last updated: January 16, 2025</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
                  <p className="text-gray-300 mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
                    <p className="text-gray-300">These cookies are necessary for the website to function properly and cannot be disabled.</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Analytics Cookies</h3>
                    <p className="text-gray-300">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Functional Cookies</h3>
                    <p className="text-gray-300">These cookies enable enhanced functionality and personalization, such as remembering your login details.</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Cookies</h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Maintain your login session</li>
                    <li>• Remember your preferences and settings</li>
                    <li>• Analyze website traffic and usage patterns</li>
                    <li>• Improve our website's performance and user experience</li>
                    <li>• Provide personalized content and recommendations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
                  <p className="text-gray-300 mb-4">
                    You can control and manage cookies in various ways:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Browser settings: Most browsers allow you to block or delete cookies</li>
                    <li>• Opt-out tools: Use browser privacy settings to limit tracking</li>
                    <li>• Third-party tools: Use privacy-focused browser extensions</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    Please note that disabling cookies may affect the functionality of our website.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
                  <p className="text-gray-300 mb-4">
                    We may use third-party services that set cookies on your device, including:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Google Analytics for website analytics</li>
                    <li>• Social media platforms for social sharing</li>
                    <li>• Payment processors for secure transactions</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                  <p className="text-gray-300">
                    If you have questions about our use of cookies, please contact us at dataquestsolutions2@gmail.com or +254 707 612 395.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
