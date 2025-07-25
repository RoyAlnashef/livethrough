import { Metadata } from 'next'
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation'
import { PolicyLayout } from '@/components/legal/policy-layout'

export const metadata: Metadata = {
  title: 'Refund Policy | LiveThrough',
  description: 'LiveThrough Refund Policy - Learn about our course cancellation terms, refund eligibility, and process for requesting refunds.',
  keywords: 'refund policy, course cancellation, refund process, survival courses, booking terms',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Refund Policy | LiveThrough',
    description: 'LiveThrough Refund Policy - Learn about our course cancellation and refund terms.',
    type: 'website',
    url: 'https://livethrough.co/refund-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Refund Policy | LiveThrough',
    description: 'LiveThrough Refund Policy - Learn about our course cancellation and refund terms.',
  },
  alternates: {
    canonical: 'https://livethrough.co/refund-policy',
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Refund Policy' },
]

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNavigation items={breadcrumbs} className="mb-8" />
      
      <PolicyLayout
        title="Refund Policy"
        lastUpdated="January 27, 2025"
        version="1.0"
      >
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Overview</h2>
              <p>
                At LiveThrough, we understand that circumstances may arise that require you to cancel a course booking. This Refund Policy outlines the terms and conditions for course cancellations and refunds on our survival course marketplace platform.
              </p>
              <p>
                Please note that refund policies may vary by individual course providers, and the terms below represent our general policy. Specific course providers may have additional or different refund terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">2.1 Full Refund Eligibility</h3>
              <p>You may be eligible for a full refund if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The course is cancelled by the course provider</li>
                <li>The course is rescheduled and you cannot attend the new date</li>
                <li>You cancel within the specified grace period (typically 24-48 hours after booking)</li>
                <li>There is a significant change to the course content or instructor</li>
                <li>You experience a documented medical emergency</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Partial Refund Eligibility</h3>
              <p>You may be eligible for a partial refund if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You cancel outside the grace period but before the course start date</li>
                <li>The course provider can fill your spot with another student</li>
                <li>You provide sufficient notice (typically 7-14 days before the course)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Non-Refundable Circumstances</h3>
              <p>Refunds are typically not available for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No-shows on the day of the course</li>
                <li>Cancellations made less than 24 hours before the course start time</li>
                <li>Weather-related cancellations (unless the course provider cancels)</li>
                <li>Personal schedule conflicts</li>
                <li>Change of mind after the grace period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Cancellation Timeframes</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-zinc-700">
                  <thead>
                    <tr className="bg-zinc-900">
                      <th className="border border-zinc-700 p-3 text-left text-white">Cancellation Time</th>
                      <th className="border border-zinc-700 p-3 text-left text-white">Refund Amount</th>
                      <th className="border border-zinc-700 p-3 text-left text-white">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    <tr>
                      <td className="border border-zinc-700 p-3">Within 24 hours of booking</td>
                      <td className="border border-zinc-700 p-3">100%</td>
                      <td className="border border-zinc-700 p-3">3-5 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-700 p-3">7+ days before course</td>
                      <td className="border border-zinc-700 p-3">75-90%</td>
                      <td className="border border-zinc-700 p-3">5-7 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-700 p-3">3-7 days before course</td>
                      <td className="border border-zinc-700 p-3">50-75%</td>
                      <td className="border border-zinc-700 p-3">7-10 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-700 p-3">Less than 3 days</td>
                      <td className="border border-zinc-700 p-3">0-50%</td>
                      <td className="border border-zinc-700 p-3">10-14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. How to Request a Refund</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">4.1 Online Cancellation</h3>
              <p>To cancel a course and request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Log into your LiveThrough account</li>
                <li>Navigate to "My Courses" or "My Account"</li>
                <li>Find the course you wish to cancel</li>
                <li>Click "Cancel Booking" or "Request Refund"</li>
                <li>Select your reason for cancellation</li>
                <li>Submit your request</li>
              </ol>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Contact Support</h3>
              <p>If you cannot cancel online or need assistance:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email us at roy@livethrough.co</li>
                <li>Call us at 1-818-669-2723</li>
                <li>Include your booking reference number</li>
                <li>Provide the reason for cancellation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Processing</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">5.1 Processing Timeline</h3>
              <p>Refunds are typically processed within 3-14 business days, depending on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your original payment method</li>
                <li>The timing of your cancellation</li>
                <li>Course provider policies</li>
                <li>Bank processing times</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Refund Methods</h3>
              <p>Refunds will be issued to your original payment method:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Credit/Debit Cards:</strong> 3-5 business days</li>
                <li><strong>PayPal:</strong> 1-3 business days</li>
                <li><strong>Bank Transfers:</strong> 5-10 business days</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Refund Notifications</h3>
              <p>You will receive email notifications at each stage of the refund process:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refund request confirmation</li>
                <li>Refund approval or denial</li>
                <li>Refund processing initiation</li>
                <li>Refund completion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Course Provider Cancellations</h2>
              <p>
                If a course provider cancels a course, you will automatically receive a full refund. We will notify you via email and process the refund within 3-5 business days.
              </p>
              <p>
                In some cases, course providers may offer alternative dates or courses. You will have the option to accept the alternative or receive a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">7.1 Dispute Process</h3>
              <p>If you disagree with a refund decision:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team within 30 days</li>
                <li>Provide detailed documentation of your situation</li>
                <li>Include any relevant evidence (medical certificates, etc.)</li>
                <li>Allow 5-7 business days for review</li>
              </ol>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Escalation</h3>
              <p>If your dispute is not resolved satisfactorily, you may:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request escalation to a senior support representative</li>
                <li>Contact the course provider directly</li>
                <li>Seek mediation through consumer protection agencies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Special Circumstances</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">8.1 Medical Emergencies</h3>
              <p>For documented medical emergencies, we may offer more flexible refund terms. Please provide:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Medical certificate or doctor's note</li>
                <li>Date of the emergency</li>
                <li>Impact on your ability to attend the course</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 Natural Disasters</h3>
              <p>In cases of natural disasters or extreme weather events, refund policies may be adjusted based on the specific circumstances and course provider policies.</p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 COVID-19 and Health Emergencies</h3>
              <p>During health emergencies, we may implement special refund policies to accommodate public health guidelines and restrictions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p>
                For questions about refunds or to request assistance, please contact us:
              </p>
              <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
                <p className="text-zinc-300">
                  <strong>Email:</strong> roy@livethrough.co<br />
                  <strong>Phone:</strong> 1-818-669-2723<br />
                  <strong>Address:</strong> Los Angeles, CA<br />
                  <strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM PST
                </p>
              </div>
              <p className="mt-4">
                For urgent matters outside business hours, please email us and we will respond within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Updates to This Policy</h2>
              <p>
                We may update this Refund Policy from time to time to reflect changes in our practices or course provider requirements. We will notify you of any material changes by posting the updated policy on this page.
              </p>
            </section>
          </PolicyLayout>
        </div>
      )
    } 