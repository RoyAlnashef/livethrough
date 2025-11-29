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
      <div className="container mx-auto px-4 pt-8 pb-16">
        <BreadcrumbNavigation items={breadcrumbs} className="mb-8 max-w-4xl mx-auto" />
        
        <PolicyLayout
          title="Privacy Policy"
          lastUpdated="July 24, 2025"
          version="1.0"
        >
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Scope</h2>
            <p className="mb-4">
              LiveThrough (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our survival course discovery platform.
            </p>
            <p className="mb-4">
              This policy complies with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable privacy laws. By using our service, you consent to the data practices described in this policy.
            </p>
            <p>
              <strong>Last Updated:</strong> July 24, 2025<br />
              <strong>Effective Date:</strong> July 24, 2025<br />
              <strong>Data Controller:</strong> LiveThrough, Los Angeles, CA
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information You Provide</h3>
            <p className="mb-4">We collect personal information that you voluntarily provide to us when using our platform:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Profile picture, bio, location, and preferences</li>
              <li><strong>User-Generated Content:</strong> Reviews, ratings, comments, and photos you submit</li>
              <li><strong>Communication Data:</strong> Messages, feedback, and support requests you send to us</li>
              <li><strong>Preferences:</strong> Course interests, search history, and platform usage preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="mb-4">We automatically collect certain information when you use our platform:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, interactions, search queries</li>
              <li><strong>Location Data:</strong> General location information (city/region level) based on IP address</li>
              <li><strong>Technical Data:</strong> Log files, error reports, performance data</li>
              <li><strong>Cookies and Tracking:</strong> Information stored by cookies and similar technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Information from Third Parties</h3>
            <p className="mb-4">We may receive information about you from third-party sources:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Social Media:</strong> If you connect your social media accounts</li>
              <li><strong>Analytics Providers:</strong> Aggregated usage statistics and insights</li>
              <li><strong>Service Providers:</strong> Information from our hosting and security partners</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">3.1 Platform Operations</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Provide and maintain our survival course discovery platform</li>
              <li>Process your account registration and manage your profile</li>
              <li>Enable course discovery, search, and filtering functionality</li>
              <li>Facilitate user reviews, ratings, and community features</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.2 Personalization and Improvement</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Personalize your experience and recommend relevant courses</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Develop new features and functionality</li>
              <li>Conduct research and analytics to enhance user experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.3 Communication</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Send important account and service notifications</li>
              <li>Provide updates about new courses and features (with consent)</li>
              <li>Respond to your questions and support requests</li>
              <li>Send marketing communications (only with explicit consent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.4 Legal and Security</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations and regulations</li>
              <li>Enforce our Terms of Service and other policies</li>
              <li>Protect our rights, property, and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="mb-4">Under GDPR, we process your personal information based on the following legal grounds:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Consent:</strong> When you explicitly agree to our processing of your data</li>
              <li><strong>Contract Performance:</strong> To provide our services and fulfill our obligations</li>
              <li><strong>Legitimate Interest:</strong> To improve our services and ensure platform security</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
            <p>
              You have the right to withdraw consent at any time, though this may affect our ability to provide certain services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Information Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">5.1 Service Providers</h3>
            <p className="mb-4">We share information with trusted third-party service providers who assist us in operating our platform:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Hosting and Infrastructure:</strong> Cloud hosting providers for data storage and processing</li>
              <li><strong>Analytics Services:</strong> To understand platform usage and improve performance</li>
              <li><strong>Security Services:</strong> To protect against fraud and security threats</li>
              <li><strong>Customer Support:</strong> To provide technical support and assistance</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">5.2 Course Providers and Schools</h3>
            <p className="mb-4">When you interact with course listings or submit reviews, certain information may be visible to course providers:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Public reviews and ratings you submit</li>
              <li>Aggregated usage statistics (no personal information)</li>
              <li>Course interest and search data (anonymized)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">5.3 Legal Requirements</h3>
            <p className="mb-4">We may disclose your information when required by law or to protect our rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>In response to legal process or government requests</li>
              <li>To protect our rights, property, or safety</li>
              <li>To prevent fraud or security threats</li>
              <li>In connection with business transfers or mergers</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">5.4 With Your Consent</h3>
            <p>
              We may share your information with third parties when you explicitly consent to such sharing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">6.1 GDPR Rights (EU/EEA Users)</h3>
            <p className="mb-4">If you are in the European Union or European Economic Area, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">6.2 CCPA Rights (California Residents)</h3>
            <p className="mb-4">If you are a California resident, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Know:</strong> Request information about personal information collected</li>
              <li><strong>Delete:</strong> Request deletion of personal information</li>
              <li><strong>Opt-Out:</strong> Opt out of the sale of personal information</li>
              <li><strong>Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">6.3 How to Exercise Your Rights</h3>
            <p className="mb-4">To exercise your privacy rights, you can:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Contact us at roy@livethrough.co</li>
              <li>Use the privacy settings in your account</li>
              <li>Follow the unsubscribe instructions in our emails</li>
            </ul>
            <p>
              We will respond to your request within 30 days (or 45 days if additional time is needed).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention and Deletion</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">7.1 Retention Periods</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Account Data:</strong> Retained while your account is active and for 2 years after deactivation</li>
              <li><strong>Usage Data:</strong> Retained for 3 years for analytics and service improvement</li>
              <li><strong>Communication Data:</strong> Retained for 2 years after the last interaction</li>
              <li><strong>Legal Records:</strong> Retained as required by applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">7.2 Deletion Process</h3>
            <p className="mb-4">When you request deletion of your account or data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We will permanently delete your personal information within 30 days</li>
              <li>Some information may be retained for legal compliance purposes</li>
              <li>Anonymized data may be retained for analytics and research</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">8.1 Security Measures</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Encryption:</strong> Data encrypted in transit and at rest using industry-standard protocols</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication requirements</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>Employee Training:</strong> Regular privacy and security training for staff</li>
              <li><strong>Incident Response:</strong> Procedures for detecting and responding to security incidents</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">8.2 Data Breach Notification</h3>
            <p>
              In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">9.1 Transfer Safeguards</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection</li>
              <li><strong>Standard Contractual Clauses:</strong> EU-approved data transfer agreements</li>
              <li><strong>Certification Schemes:</strong> Privacy Shield or equivalent certifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">9.2 Your Rights</h3>
            <p>
              You have the right to obtain information about the safeguards we use for international transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small text files stored on your device that help us provide personalized content and improve our services.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">10.1 How We Use Cookies</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand platform usage and improve performance</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and personalize your experience</li>
              <li><strong>Marketing Cookies:</strong> Used for advertising and marketing (only with your consent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">10.2 Cookie Consent</h3>
            <p className="mb-4">
              We obtain your consent before setting non-essential cookies. You can manage your cookie preferences through our cookie consent banner or your browser settings.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">10.3 Detailed Cookie Information</h3>
            <p>
              For detailed information about the specific cookies we use, their purposes, durations, and how to manage them, please see our <a href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Children&apos;s Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
            <p>
              If you believe we have collected information from a child under 13, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
            </p>
            <p className="mb-4">
              <strong>Notification of Changes:</strong> We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            <p>
              <strong>Continued Use:</strong> Your continued use of our platform after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
              <p className="text-zinc-300">
                <strong>Email:</strong> roy@livethrough.co<br />
                <strong>Phone:</strong> 1-818-669-2723<br />
                <strong>Address:</strong> Los Angeles, CA<br />
                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM PST
              </p>
            </div>
            <p className="mt-4">
              <strong>Data Protection Officer:</strong> For GDPR-related inquiries, you can contact our designated data protection officer at the email address above.
            </p>
            <p className="mt-4">
              <strong>Complaints:</strong> You have the right to lodge a complaint with your local data protection authority if you believe we have not addressed your concerns adequately.
            </p>
          </section>
        </PolicyLayout>
    </div>
  )
} 