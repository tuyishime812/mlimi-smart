import { Sprout, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">MLIMI Smart</p>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: April 27, 2026</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p>MLIMI Smart is designed to respect your privacy. We collect minimal data necessary to provide our services:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Chat Messages:</strong> Your messages are processed to provide AI-powered agricultural advice and are not stored permanently.</li>
              <li><strong>Uploaded Images:</strong> Images uploaded for disease detection are processed temporarily and not shared with third parties.</li>
              <li><strong>Device Information:</strong> Basic device info for app functionality and analytics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide AI-powered farming assistance and disease detection</li>
              <li>To improve our services and user experience</li>
              <li>To personalize your experience within the app</li>
              <li>To ensure app security and prevent abuse</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Data Storage and Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We implement appropriate security measures to protect your information from unauthorized access or disclosure.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
            <p>We may use third-party services for:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>AI processing (disease detection, chat responses)</li>
              <li>Analytics to improve our app</li>
              <li>Weather data from external APIs</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of data collection</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at:</p>
            <p className="font-medium">support@mlimismart.com</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Updates to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>
        </div>
      </main>
    </div>
  );
}