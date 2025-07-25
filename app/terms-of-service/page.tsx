import { Metadata } from 'next'
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation'
import { PolicyLayout } from '@/components/legal/policy-layout'

export const metadata: Metadata = {
  title: 'Terms of Service | LiveThrough',
  description: 'LiveThrough Terms of Service - Learn about our terms, conditions, and user agreements for the survival course marketplace.',
  keywords: 'terms of service, user agreement, survival courses, marketplace terms',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service | LiveThrough',
    description: 'LiveThrough Terms of Service - Learn about our terms, conditions, and user agreements.',
    type: 'website',
    url: 'https://livethrough.co/terms-of-service',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | LiveThrough',
    description: 'LiveThrough Terms of Service - Learn about our terms, conditions, and user agreements.',
  },
  alternates: {
    canonical: 'https://livethrough.co/terms-of-service',
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Terms of Service' },
]

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNavigation items={breadcrumbs} className="mb-8" />
      <PolicyLayout
        title="Terms of Service"
        lastUpdated="January 27, 2025"
        version="1.0"
      >
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using LiveThrough ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                LiveThrough is a marketplace platform that connects survival course students with certified survival schools and instructors. We provide course discovery, booking, and management tools for both students and educational institutions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Registration and Accounts</h2>
              <p>
                To access certain features of our service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Course Booking and Payments</h2>
              <p>
                Course bookings are subject to availability and the terms set by individual schools and instructors. All payments are processed securely through our platform, and you agree to pay all fees associated with your course bookings.
              </p>
              <p>
                Course prices, availability, and terms are subject to change without notice. We reserve the right to modify or discontinue any course offering at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
              <p>
                The content on LiveThrough, including but not limited to text, graphics, images, logos, and software, is the property of LiveThrough or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works of any content without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. User Conduct</h2>
              <p>
                You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, LiveThrough shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our total liability to you for any claims arising from the use of our service shall not exceed the amount you paid to us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or your use of our service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
              <p>
                You agree to waive any right to a jury trial or to participate in a class action lawsuit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our service at any time, with or without cause, with or without notice, effective immediately.
              </p>
              <p>
                Upon termination, your right to use the service will cease immediately, and we may delete your account and all associated data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p>
                Your continued use of the service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                <p className="text-zinc-300">
                  <strong>Email:</strong> roy@livethrough.co<br />
                  <strong>Phone:</strong> 1-818-669-2723<br />
                  <strong>Address:</strong> Los Angeles, CA
                </p>
              </div>
            </section>
                      </PolicyLayout>
          </div>
        )
      } 