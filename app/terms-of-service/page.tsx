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
      <div className="container mx-auto px-4 pt-8 pb-16">
        <BreadcrumbNavigation items={breadcrumbs} className="mb-8 max-w-4xl mx-auto" />
        <PolicyLayout
          title="Terms of Service"
          lastUpdated="July 24, 2025"
          version="1.0"
        >
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using LiveThrough (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the LiveThrough platform, including our website, mobile applications, and any related services (collectively, the &ldquo;Service&rdquo;). By using our Service, you agree to these Terms and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">
              LiveThrough is a marketplace platform that connects survival course students with certified survival schools and instructors. We provide course discovery, booking, and management tools for both students and educational institutions.
            </p>
            <p className="mb-4">
              Our Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Course discovery and search functionality</li>
              <li>Secure payment processing for course bookings</li>
              <li>User account management and course tracking</li>
              <li>Communication tools between students and instructors</li>
              <li>Review and rating systems</li>
              <li>Customer support and dispute resolution</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of our Service at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Registration and Account Terms</h2>
            <p className="mb-4">
              To access certain features of our Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              <strong>Account Requirements:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>You must be at least 18 years old to create an account</li>
              <li>You may only create one account per person</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
            <p className="mb-4">
              <strong>Account Termination:</strong> We may terminate or suspend your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion.
            </p>
            <p>
              Upon account termination, you will lose access to all course materials, reviews, and account data. We are not responsible for any loss of data resulting from account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Platform Usage and Content</h2>
            <p className="mb-4">
              LiveThrough provides a platform for discovering and learning about survival courses and schools. Users can browse course listings, read reviews, and access educational content about survival training.
            </p>
            <p className="mb-4">
              <strong>Platform Features:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Course discovery and search functionality</li>
              <li>School and instructor profiles</li>
              <li>User reviews and ratings</li>
              <li>Educational content and resources</li>
              <li>Community features and discussions</li>
            </ul>
            <p className="mb-4">
              <strong>Content Guidelines:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>All content must be accurate and truthful</li>
              <li>Reviews must be based on actual experiences</li>
              <li>Content must not violate any applicable laws</li>
              <li>Users are responsible for the content they submit</li>
            </ul>
            <p>
              <strong>Service Availability:</strong> We strive to maintain high availability of our platform, but we do not guarantee uninterrupted access. We may perform maintenance or updates that temporarily affect service availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-4">
              The content on LiveThrough, including but not limited to text, graphics, images, logos, software, and course materials, is the property of LiveThrough or its content suppliers and is protected by copyright and other intellectual property laws.
            </p>
            <p className="mb-4">
              <strong>Our Intellectual Property:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>LiveThrough trademarks, logos, and branding</li>
              <li>Platform design, layout, and user interface</li>
              <li>Proprietary software and algorithms</li>
              <li>Course marketplace infrastructure</li>
            </ul>
            <p className="mb-4">
              <strong>User-Generated Content:</strong> By submitting content to our platform (reviews, photos, comments), you grant us a non-exclusive, royalty-free license to use, modify, and distribute such content in connection with our Service.
            </p>
            <p className="mb-4">
              <strong>Course Content:</strong> Course materials provided by instructors remain the intellectual property of the respective instructors or schools. You may not reproduce, distribute, or share course materials without explicit permission.
            </p>
            <p>
              <strong>Restrictions:</strong> You may not reproduce, distribute, modify, or create derivative works of any content without our express written consent or the consent of the respective content owner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. User Conduct and Prohibited Activities</h2>
            <p className="mb-4">
              You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Harass, abuse, or harm other users or instructors</li>
              <li>Submit false or misleading information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Use automated systems to access the Service</li>
              <li>Share account credentials with others</li>
              <li>Attempt to reverse engineer or hack the platform</li>
              <li>Use the Service to promote competing services</li>
            </ul>
            <p>
              Violation of these conduct rules may result in immediate account termination and legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, LiveThrough shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            <p className="mb-4">
              <strong>Service Availability:</strong> We do not guarantee that our Service will be available at all times. We may experience downtime due to maintenance, technical issues, or other factors beyond our control.
            </p>
            <p className="mb-4">
              <strong>Course Safety:</strong> While we vet our instructors and schools, we cannot guarantee the safety of outdoor activities. Participation in survival courses involves inherent risks, and you participate at your own risk.
            </p>
            <p className="mb-4">
              <strong>Third-Party Services:</strong> We are not responsible for the actions, content, or services of third-party instructors, schools, or payment processors.
            </p>
            <p>
              <strong>Maximum Liability:</strong> Our total liability to you for any claims arising from the use of our Service shall not exceed the amount you paid to us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes arising from these Terms or your use of our Service shall be resolved through the following process:
            </p>
            <p className="mb-4">
              <strong>Informal Resolution:</strong> We encourage you to contact us first to attempt to resolve any disputes informally. Most issues can be resolved through direct communication.
            </p>
            <p className="mb-4">
              <strong>Binding Arbitration:</strong> If informal resolution is not successful, any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (AAA).
            </p>
            <p className="mb-4">
              <strong>Arbitration Terms:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Arbitration will be conducted in Los Angeles, California</li>
              <li>You agree to waive any right to a jury trial</li>
              <li>You agree not to participate in class action lawsuits</li>
              <li>Arbitration decisions are final and binding</li>
            </ul>
            <p>
              <strong>Exceptions:</strong> Small claims court cases and intellectual property disputes may be brought in court instead of arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Termination and Account Closure</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to our Service at any time, with or without cause, with or without notice, effective immediately.
            </p>
            <p className="mb-4">
              <strong>Grounds for Termination:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Harassment or abuse of other users</li>
              <li>Non-payment of fees</li>
              <li>Extended period of account inactivity</li>
            </ul>
            <p className="mb-4">
              <strong>Effect of Termination:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Your right to use the Service will cease immediately</li>
                            <li>We may delete your account and all associated data</li>
              <li>Your account data and reviews may be permanently deleted</li>
            </ul>
            <p>
              <strong>Survival of Terms:</strong> Certain provisions of these Terms will survive termination, including intellectual property rights, limitation of liability, and dispute resolution clauses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
            <p className="mb-4">
              <strong>Notification Methods:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Email notification to registered users</li>
              <li>In-app notifications</li>
              <li>Prominent notice on our website</li>
            </ul>
            <p className="mb-4">
              <strong>Acceptance of Changes:</strong> Your continued use of the Service after any changes constitutes acceptance of the new Terms. If you do not agree to the changes, you must stop using our Service.
            </p>
            <p>
              <strong>Material Changes:</strong> For material changes that significantly affect your rights, we will provide at least 30 days&apos; notice before the changes take effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
            </p>
            <p>
              Any legal proceedings arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Los Angeles County, California, except as otherwise provided in the dispute resolution section.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
              For urgent matters related to platform access or safety concerns, please contact us immediately by phone.
            </p>
          </section>
        </PolicyLayout>
    </div>
  )
} 