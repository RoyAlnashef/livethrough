import { Metadata } from 'next'
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation'
import { PolicyLayout } from '@/components/legal/policy-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy | LiveThrough',
  description: 'LiveThrough Privacy Policy - Learn how we collect, use, and protect your personal information in compliance with GDPR and CCPA.',
  keywords: 'privacy policy, data protection, GDPR, CCPA, personal information, data collection',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy | LiveThrough',
    description: 'LiveThrough Privacy Policy - Learn how we collect, use, and protect your personal information.',
    type: 'website',
    url: 'https://livethrough.co/privacy-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | LiveThrough',
    description: 'LiveThrough Privacy Policy - Learn how we collect, use, and protect your personal information.',
  },
  alternates: {
    canonical: 'https://livethrough.co/privacy-policy',
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy' },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNavigation items={breadcrumbs} className="mb-8" />
      
      <PolicyLayout
        title="Privacy Policy"
        lastUpdated="January 27, 2025"
        version="1.0"
      >
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                LiveThrough ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our survival course marketplace platform.
              </p>
              <p>
                This policy complies with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). By using our service, you consent to the data practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
              <p>We collect personal information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Course preferences and booking history</li>
                <li>Communications with us and other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>Location data (with your consent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our marketplace platform</li>
                <li>Process course bookings and payments</li>
                <li>Communicate with you about your account and courses</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our services and user experience</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-white mb-3">4.1 Service Providers</h3>
              <p>We share information with trusted third-party service providers who assist us in operating our platform, including payment processors, hosting providers, and analytics services.</p>

              <h3 className="text-xl font-semibold text-white mb-3">4.2 Course Providers</h3>
              <p>When you book a course, we share necessary information with the course provider to facilitate your enrollment and participation.</p>

              <h3 className="text-xl font-semibold text-white mb-3">4.3 Legal Requirements</h3>
              <p>We may disclose your information if required by law or to protect our rights, property, or safety, or that of our users or the public.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">5.1 Access and Portability</h3>
              <p>You have the right to access and receive a copy of your personal information in a portable format.</p>

              <h3 className="text-xl font-semibold text-white mb-3">5.2 Correction and Updates</h3>
              <p>You can update or correct your personal information through your account settings or by contacting us.</p>

              <h3 className="text-xl font-semibold text-white mb-3">5.3 Deletion</h3>
              <p>You may request deletion of your personal information, subject to certain legal and contractual obligations.</p>

              <h3 className="text-xl font-semibold text-white mb-3">5.4 Opt-Out</h3>
              <p>You can opt out of marketing communications at any time by following the unsubscribe instructions in our emails or contacting us.</p>

              <h3 className="text-xl font-semibold text-white mb-3">5.5 Data Portability</h3>
              <p>You have the right to receive your personal information in a structured, commonly used, machine-readable format.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                <p className="text-zinc-300">
                  <strong>Email:</strong> roy@livethrough.co<br />
                  <strong>Phone:</strong> 1-818-669-2723<br />
                  <strong>Address:</strong> Los Angeles, CA
                </p>
              </div>
              <p className="mt-4">
                For GDPR-related inquiries, you also have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>
          </PolicyLayout>
        </div>
      )
    } 