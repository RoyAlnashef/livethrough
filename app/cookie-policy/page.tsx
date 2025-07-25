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
    url: 'https://livethrough.co/cookie-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | LiveThrough',
    description: 'LiveThrough Cookie Policy - Learn about the cookies we use and how to manage them.',
  },
  alternates: {
    canonical: 'https://livethrough.co/cookie-policy',
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Cookie Policy' },
]

export default function CookiePolicyPage() {
  return (
      <div className="container mx-auto px-4 pt-8 pb-16">
        <BreadcrumbNavigation items={breadcrumbs} className="mb-8 max-w-4xl mx-auto" />
        
        <PolicyLayout
          title="Cookie Policy"
          lastUpdated="July 24, 2025"
          version="1.0"
        >
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              This Cookie Policy explains how LiveThrough (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) uses cookies and similar tracking technologies when you visit our survival course discovery platform.
            </p>
            <p className="mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.
            </p>
            <p>
              This policy is part of our broader Privacy Policy and complies with applicable privacy laws, including GDPR and CCPA. By using our platform, you consent to our use of cookies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Essential Cookies</h3>
            <p className="mb-4">These cookies are necessary for the website to function properly and cannot be disabled. They enable basic functions like page navigation, access to secure areas, and form submissions.</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Authentication:</strong> User login and session management</li>
              <li><strong>Security:</strong> CSRF protection and fraud prevention</li>
              <li><strong>Performance:</strong> Load balancing and server optimization</li>
              <li><strong>Functionality:</strong> Core platform features and navigation</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Functional Cookies</h3>
            <p className="mb-4">These cookies enhance your experience by remembering your preferences and settings. They are not essential but improve platform usability.</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>User Preferences:</strong> Language, region, and display settings</li>
              <li><strong>Search Filters:</strong> Course search preferences and filters</li>
              <li><strong>Interface Customization:</strong> Theme and layout preferences</li>
              <li><strong>Favorites:</strong> Saved courses and schools</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Analytics Cookies</h3>
            <p className="mb-4">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our platform.</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Usage Analytics:</strong> Page views, navigation patterns, and user journeys</li>
              <li><strong>Performance Monitoring:</strong> Site speed, error tracking, and technical issues</li>
              <li><strong>Content Insights:</strong> Popular courses, search terms, and user interests</li>
              <li><strong>Platform Optimization:</strong> Feature usage and improvement opportunities</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.4 Marketing Cookies</h3>
            <p className="mb-4">These cookies are used for advertising and marketing purposes. They help us deliver relevant content and measure the effectiveness of our marketing campaigns.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Retargeting:</strong> Show relevant ads based on your interests</li>
              <li><strong>Social Media:</strong> Integration with social media platforms</li>
              <li><strong>Email Marketing:</strong> Optimize email campaigns and content</li>
              <li><strong>Campaign Tracking:</strong> Measure marketing campaign effectiveness</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Detailed Cookie Information</h2>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-zinc-700">
                <thead>
                  <tr className="bg-zinc-900">
                    <th className="border border-zinc-700 p-3 text-left text-white">Cookie Name</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Purpose</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Duration</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Type</th>
                    <th className="border border-zinc-700 p-3 text-left text-white">Provider</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr>
                    <td className="border border-zinc-700 p-3">session_id</td>
                    <td className="border border-zinc-700 p-3">User authentication and session management</td>
                    <td className="border border-zinc-700 p-3">Session</td>
                    <td className="border border-zinc-700 p-3">Essential</td>
                    <td className="border border-zinc-700 p-3">LiveThrough</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">csrf_token</td>
                    <td className="border border-zinc-700 p-3">Security and fraud prevention</td>
                    <td className="border border-zinc-700 p-3">Session</td>
                    <td className="border border-zinc-700 p-3">Essential</td>
                    <td className="border border-zinc-700 p-3">LiveThrough</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">user_preferences</td>
                    <td className="border border-zinc-700 p-3">Store user preferences and settings</td>
                    <td className="border border-zinc-700 p-3">1 year</td>
                    <td className="border border-zinc-700 p-3">Functional</td>
                    <td className="border border-zinc-700 p-3">LiveThrough</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">search_filters</td>
                    <td className="border border-zinc-700 p-3">Remember course search preferences</td>
                    <td className="border border-zinc-700 p-3">6 months</td>
                    <td className="border border-zinc-700 p-3">Functional</td>
                    <td className="border border-zinc-700 p-3">LiveThrough</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_ga</td>
                    <td className="border border-zinc-700 p-3">Google Analytics tracking and analytics</td>
                    <td className="border border-zinc-700 p-3">2 years</td>
                    <td className="border border-zinc-700 p-3">Analytics</td>
                    <td className="border border-zinc-700 p-3">Google</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_ga_*</td>
                    <td className="border border-zinc-700 p-3">Google Analytics session tracking</td>
                    <td className="border border-zinc-700 p-3">2 years</td>
                    <td className="border border-zinc-700 p-3">Analytics</td>
                    <td className="border border-zinc-700 p-3">Google</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_fbp</td>
                    <td className="border border-zinc-700 p-3">Facebook pixel for advertising</td>
                    <td className="border border-zinc-700 p-3">3 months</td>
                    <td className="border border-zinc-700 p-3">Marketing</td>
                    <td className="border border-zinc-700 p-3">Meta</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-3">_fbc</td>
                    <td className="border border-zinc-700 p-3">Facebook click tracking</td>
                    <td className="border border-zinc-700 p-3">2 years</td>
                    <td className="border border-zinc-700 p-3">Marketing</td>
                    <td className="border border-zinc-700 p-3">Meta</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              <strong>Note:</strong> Cookie durations may vary based on your browser settings and usage patterns. Session cookies are deleted when you close your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">We use third-party services that may set their own cookies on our platform:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 Google Analytics</h3>
            <p className="mb-4">We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our site, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Pages visited and time spent on each page</li>
              <li>Navigation patterns and user journeys</li>
              <li>Geographic location and device information</li>
              <li>Traffic sources and referral information</li>
            </ul>
            <p className="mb-4">Google Analytics data is processed in accordance with Google&apos;s Privacy Policy. You can opt out of Google Analytics tracking using the Google Analytics Opt-out Browser Add-on.</p>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 Social Media Platforms</h3>
            <p className="mb-4">Social media platforms may set cookies when you interact with social media features on our website:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Facebook/Meta:</strong> For social sharing and advertising</li>
              <li><strong>Twitter:</strong> For social sharing and embedded content</li>
              <li><strong>LinkedIn:</strong> For professional networking features</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.3 Other Third-Party Services</h3>
            <p className="mb-4">We may use other third-party services that set cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Hosting Services:</strong> For performance and security</li>
              <li><strong>CDN Services:</strong> For content delivery optimization</li>
              <li><strong>Security Services:</strong> For fraud prevention and protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookie Consent Management</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">5.1 Consent Requirements</h3>
            <p className="mb-4">We obtain your consent before setting non-essential cookies (functional, analytics, and marketing cookies). Essential cookies are necessary for platform functionality and do not require consent.</p>

            <h3 className="text-xl font-semibold text-white mb-3">5.2 Cookie Banner</h3>
            <p className="mb-4">When you first visit our website, you will see a cookie consent banner that allows you to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
              <li>Learn more about our cookie usage</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">5.3 Updating Preferences</h3>
            <p className="mb-4">You can update your cookie preferences at any time by:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Clicking the cookie settings link in our footer</li>
              <li>Using your browser settings to manage cookies</li>
              <li>Contacting us to update your preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">6.1 Browser Settings</h3>
            <p className="mb-4">You can control cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>View and delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Set preferences for different types of cookies</li>
              <li>Clear cookies when you close your browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">6.2 Browser-Specific Instructions</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Chrome</h4>
                <p className="text-zinc-300">Settings → Privacy and security → Cookies and other site data → Manage cookies and site data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Firefox</h4>
                <p className="text-zinc-300">Options → Privacy & Security → Cookies and Site Data → Manage Data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Safari</h4>
                <p className="text-zinc-300">Preferences → Privacy → Manage Website Data</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Edge</h4>
                <p className="text-zinc-300">Settings → Cookies and site permissions → Cookies and site data → Manage and delete cookies and site data</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">6.3 Opt-Out Tools</h3>
            <p className="mb-4">You can also opt out of certain types of cookies using these tools:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              <li><strong>Digital Advertising Alliance:</strong> <a href="https://optout.aboutads.info" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
              <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Consequences of Disabling Cookies</h2>
            <p className="mb-4">
              If you disable cookies, some features of our website may not function properly. You may experience:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Difficulty logging into your account</li>
              <li>Loss of saved preferences and settings</li>
              <li>Reduced functionality of course search and filtering</li>
              <li>Less personalized content and recommendations</li>
              <li>Inability to use certain platform features</li>
              <li>Reduced performance and user experience</li>
            </ul>
            <p>
              <strong>Note:</strong> Essential cookies cannot be disabled as they are required for basic platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Updates to This Cookie Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices, new technologies, or for other operational, legal, or regulatory reasons.
            </p>
            <p className="mb-4">
              <strong>Notification of Changes:</strong> We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the &ldquo;Last updated&rdquo; date</li>
              <li>Sending email notifications to registered users (for significant changes)</li>
            </ul>
            <p>
              <strong>Continued Use:</strong> Your continued use of our platform after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
              For privacy-related inquiries, you can also refer to our <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
            </p>
          </section>
        </PolicyLayout>
    </div>
  )
} 