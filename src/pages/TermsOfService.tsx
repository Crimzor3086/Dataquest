
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: January 16, 2025</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-300 mb-4">
                    By accessing and using DataQuest Solutions services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                  <p className="text-gray-300 mb-4">
                    DataQuest Solutions provides data science training, software development, web development, graphic design services, and consultation services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Provide accurate and complete information when registering</li>
                    <li>• Maintain the confidentiality of your account credentials</li>
                    <li>• Use our services in compliance with applicable laws</li>
                    <li>• Respect intellectual property rights</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
                  <p className="text-gray-300 mb-4">
                    Payment for services must be made according to the agreed terms. Refunds are subject to our refund policy and may vary by service type.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                  <p className="text-gray-300 mb-4">
                    All content, materials, and intellectual property provided by DataQuest Solutions remain our property unless otherwise specified in writing.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                  <p className="text-gray-300 mb-4">
                    DataQuest Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
                  <p className="text-gray-300">
                    For questions about these Terms of Service, please contact us at dataquestsolutions2@gmail.com or +254 707 612 395.
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

export default TermsOfService;
