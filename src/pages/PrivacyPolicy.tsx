
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: January 16, 2025</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                  <p className="text-gray-300 mb-4">
                    We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support.
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Personal information (name, email, phone number)</li>
                    <li>• Educational and professional background</li>
                    <li>• Payment information</li>
                    <li>• Course progress and completion data</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Provide and improve our services</li>
                    <li>• Process payments and manage your account</li>
                    <li>• Send you course updates and educational content</li>
                    <li>• Respond to your inquiries and provide customer support</li>
                    <li>• Analyze usage patterns to improve our platform</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                  <p className="text-gray-300 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• With your consent</li>
                    <li>• To comply with legal obligations</li>
                    <li>• With service providers who assist in our operations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                  <p className="text-gray-300 mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Request deletion of your information</li>
                    <li>• Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                  <p className="text-gray-300">
                    If you have questions about this Privacy Policy, please contact us at dataquestsolutions2@gmail.com or +254 707 612 395.
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

export default PrivacyPolicy;
