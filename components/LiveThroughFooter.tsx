import Link from "next/link"
import { Shield, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function LiveThroughFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold text-white">LIVETHROUGH</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Master the skills to survive anything. From wilderness survival to urban preparedness, we provide the
              training you need to thrive in any situation.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Courses Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Wilderness Survival
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Urban Preparedness
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Tactical Training
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  First Aid & Medical
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Self-Defense
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Homesteading
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Emergency Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Survival Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Gear Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Free Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Certification
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Affiliate Program
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@livethrough.co</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>1-800-SURVIVE</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Colorado Springs, CO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-zinc-400 text-sm">© 2025 LiveThrough.co. All rights reserved.</div>
            <div className="flex space-x-6">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 