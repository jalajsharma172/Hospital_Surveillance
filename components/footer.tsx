import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      <div className="w-[75%] mx-auto py-16 flex flex-row justify-between gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-[280px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 bg-blue-600/20 border border-blue-500/40 rounded-sm">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold font-mono">
              SURAKSHA<span className="text-blue-400">AI</span>
            </h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Hospital-grade security intelligence. Protecting doctors, monitoring staff, and ensuring patient safety — 24/7.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 text-xs font-semibold tracking-wide">LIVE MONITORING</span>
          </div>
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Platform</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li><Link href="/surveillance" className="hover:text-white transition-colors">Security Dashboard</Link></li>
            <li><Link href="/realtime" className="hover:text-white transition-colors">Live Feed</Link></li>
            <li><Link href="/library" className="hover:text-white transition-colors">Incident Library</Link></li>
          </ul>
        </div>

        {/* Detection Capabilities */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Detection</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="text-red-400">Aggression vs Doctors</li>
            <li className="text-yellow-400">Staff Negligence</li>
            <li className="text-emerald-400">Patient Falls</li>
            <li className="text-purple-400">Unauthorized Access</li>
            <li className="text-blue-400">Zone Breach Alerts</li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Company</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Deploy Now</h3>
          <p className="text-white/50 text-sm">Protect your hospital staff and patients with AI.</p>
          <Link
            href="/sign-up"
            className="mt-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/surveillance"
            className="px-6 py-3 rounded-xl border border-white/20 text-sm font-semibold text-center hover:border-white/60 transition-colors"
          >
            View Dashboard
          </Link>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="w-[75%] mx-auto flex flex-row items-center justify-between text-white/30 text-xs">
          <p>© {new Date().getFullYear()} Suraksha AI. All rights reserved. Built for Hospital Security.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}