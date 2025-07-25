import { Metadata } from 'next'
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation'
import { PolicyLayout } from '@/components/legal/policy-layout'

export const metadata: Metadata = {
  title: 'Cookie Policy | LiveThrough',
  description: 'LiveThrough Cookie Policy - Learn about the cookies we use, their purpose, and how to manage your cookie preferences.',
  keywords: 'cookie policy, cookies, tracking, privacy, browser settings, opt-out',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Cookie Policy | LiveThrough',
    description: 'LiveThrough Cookie Policy - Learn about the cookies we use and how to manage them.',
    type: 'website',
    url: 'https://livethrough.com/legal/cookie-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | LiveThrough',
    description: 'LiveThrough Cookie Policy - Learn about the cookies we use and how to manage them.',
  },
  alternates: {
    canonical: 'https://livethrough.com/legal/cookie-policy',
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Legal', href: '/legal' },
  { label: 'Cookie Policy' },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation items={breadcrumbs} className="mb-8" />
        
        <PolicyLayout
          title="Cookie Policy"
          lastUpdated="January 27, 2025"
          version="1.0"
        >
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Load balancing and performance</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Functional Cookies</h3>
            <p>These cookies enhance your experience by remembering your preferences and settings.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Language and region preferences</li>
              <li>Course search filters and favorites</li>
              <li>User interface customization</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Page views and navigation patterns</li>
              <li>Course popularity and search terms</li>
              <li>Performance and error monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.4 Marketing Cookies</h3>
            <p>These cookies are used to track visitors across websites to display relevant advertisements.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Retargeting and remarketing campaigns</li>
              <li>Social media integration</li>
              <li>Email marketing optimization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-zinc-700">
                <thead>
                  <tr className="bg-zinc-900">
                    <th className="border border-zinc-700 p-3 text-left text-white">Cookie Name</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Purpose</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Duration</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Type</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr>
                    <td className="border border-zinc-700 p-3">session_id</td>
                    <td className="border border-zinc-700 p-3">User authentication and session management</td>
                    <td className="border border-zinc-700 p-3">Session</td>
                    <td className="border border-zinc-700 p-3">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">csrf_token</td>
                    <td className="border border-zinc-700 p-3">Security and fraud prevention</td>
                    <td className="border border-zinc-700 p-3">Session</td>
                    <td className="border border-zinc-700 p-3">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">user_preferences</td>
                    <td className="border border-zinc-700 p-3">Store user preferences and settings</td>
                    <td className="border border-zinc-700 p-3">1 year</td>
                    <td className="border border-zinc-700 p-3">Functional</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_ga</td>
                    <td className="border border-zinc-700 p-3">Google Analytics tracking</td>
                    <td className="border border-zinc-700 p-3">2 years</td>
                    <td className="border border-zinc-700 p-3">Analytics</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_fbp</td>
                    <td className="border border-zinc-700 p-3">Facebook pixel for advertising</td>
                    <td className="border border-zinc-700 p-3">3 months</td>
                    <td className="border border-zinc-700 p-3">Marketing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
            <p>We use third-party services that may set their own cookies:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 Google Analytics</h3>
            <p>We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our site.</p>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 Social Media</h3>
            <p>Social media platforms may set cookies when you interact with social media features on our website.</p>

            <h3 className="text-xl font-semibold text-white mb-3">4.3 Payment Processors</h3>
            <p>Payment processing services may set cookies to ensure secure transactions and prevent fraud.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">5.1 Browser Settings</h3>
            <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>View and delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Set preferences for different types of cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Browser-Specific Instructions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Chrome</h4>
                <p className="text-zinc-300">Settings → Privacy and security → Cookies and other site data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Firefox</h4>
                <p className="text-zinc-300">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Safari</h4>
                <p className="text-zinc-300">Preferences → Privacy → Manage Website Data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Edge</h4>
                <p className="text-zinc-300">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Opt-Out Tools</h3>
            <p>You can also opt out of certain types of cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> Use the Google Analytics Opt-out Browser Add-on</li>
              <li><strong>Facebook:</strong> Adjust your Facebook ad preferences</li>
              <li><strong>Digital Advertising Alliance:</strong> Visit optout.aboutads.info</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Consequences of Disabling Cookies</h2>
            <p>
              If you disable cookies, some features of our website may not function properly. You may experience:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Difficulty logging into your account</li>
              <li>Loss of saved preferences and settings</li>
              <li>Reduced functionality of course search and filtering</li>
              <li>Inability to complete course bookings</li>
              <li>Less personalized content and recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
    </div>
  )
} 