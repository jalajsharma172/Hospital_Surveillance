import Link from "next/link"
import Footer from "@/components/footer"

// Incident definitions for hospital security
const incidents = [
  {
    badge: "🚨 PATIENT AGGRESSION",
    color: "red",
    title: "Violence Against",
    highlight: "Doctors & Nurses",
    desc: "Detects physical and verbal attacks on hospital staff in real-time. Security dispatched before the situation escalates.",
    features: ["Physical assault detection", "Verbal aggression flagging", "Mob crowd alerts"],
    gifSrc: "/gifs/fight.gif",
    alertText: "AGGRESSION DETECTED",
    layout: "normal",
  },
  {
    badge: "⚠️ STAFF NEGLIGENCE",
    color: "yellow",
    title: "Staff Duty &",
    highlight: "Negligence Monitoring",
    desc: "Catches staff sleeping on duty, abandoning patients, skipping hygiene checks, and loitering in restricted zones.",
    features: ["Sleeping on duty alerts", "Patient abandonment flags", "Hygiene protocol violations"],
    gifSrc: "/gifs/theft.gif",
    alertText: "NEGLIGENCE FLAGGED",
    layout: "reverse",
  },
  {
    badge: "👶 INFANT SECURITY",
    color: "pink",
    title: "Missing Infant &",
    highlight: "Newborn Protection",
    desc: "Monitors all entrances and maternity ward exits 24/7. Instantly flags any unauthorized removal of newborns or infants from secure zones.",
    features: ["Unauthorized infant removal", "Exit zone monitoring", "Maternity ward perimeter alert"],
    gifSrc: "/gifs/theft.gif",
    alertText: "INFANT SECURITY BREACH",
    layout: "normal",
    isNew: true,
  },
  {
    badge: "🔥 FIRE & SMOKE",
    color: "orange",
    title: "Fire & Smoke",
    highlight: "Detection",
    desc: "AI-powered smoke and fire detection across all hospital zones — wards, ICUs, labs, kitchens. Triggers automatic evacuation protocols.",
    features: ["Multi-zone fire detection", "Smoke pattern recognition", "Automatic alert + evacuation"],
    gifSrc: "/gifs/fire.gif",
    alertText: "FIRE HAZARD DETECTED",
    layout: "reverse",
    isNew: true,
  },
  {
    badge: "🏃 PATIENT FALL",
    color: "emerald",
    title: "Patient Falls &",
    highlight: "Emergency Response",
    desc: "Instant detection of patient falls in wards, corridors, and washrooms — day or night. Emergency nursing alerts within seconds.",
    features: ["Real-time fall detection", "Night-time monitoring", "Unattended patient alerts"],
    gifSrc: "/gifs/fall.gif",
    alertText: "FALL DETECTED",
    layout: "normal",
  },
  {
    badge: "🔒 UNAUTHORIZED ACCESS",
    color: "purple",
    title: "Restricted Zone",
    highlight: "Access Control",
    desc: "Enforces perimeter security for ICUs, OTs, pharmacies, and labs. Any unauthorized entry is flagged instantly with camera stills.",
    features: ["ICU / OT enforcement", "Pharmacy access tracking", "After-hours intrusion"],
    gifSrc: "/gifs/fire.gif",
    alertText: "BREACH DETECTED",
    layout: "reverse",
  },
]

const colorMap: Record<string, {badge: string; title: string; alert: string; border: string; hoverBorder: string; dot: string}> = {
  red:    { badge: "bg-red-500/10 border-red-500/30 text-red-400",    title: "text-red-400",    alert: "text-red-400 border-red-500",    border: "border-red-500/20",   hoverBorder: "group-hover:border-red-500/50",   dot: "bg-red-500" },
  yellow: { badge: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400", title: "text-yellow-400", alert: "text-yellow-400 border-yellow-500", border: "border-yellow-500/20", hoverBorder: "group-hover:border-yellow-500/50", dot: "bg-yellow-500" },
  pink:   { badge: "bg-pink-500/10 border-pink-500/30 text-pink-400",  title: "text-pink-400",   alert: "text-pink-400 border-pink-500",   border: "border-pink-500/20",  hoverBorder: "group-hover:border-pink-500/50",   dot: "bg-pink-500" },
  orange: { badge: "bg-orange-500/10 border-orange-500/30 text-orange-400", title: "text-orange-400", alert: "text-orange-400 border-orange-500", border: "border-orange-500/20", hoverBorder: "group-hover:border-orange-500/50", dot: "bg-orange-500" },
  emerald:{ badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", title: "text-emerald-400", alert: "text-emerald-400 border-emerald-500", border: "border-emerald-500/20", hoverBorder: "group-hover:border-emerald-500/50", dot: "bg-emerald-500" },
  purple: { badge: "bg-purple-500/10 border-purple-500/30 text-purple-400", title: "text-purple-400", alert: "text-purple-400 border-purple-500", border: "border-purple-500/20", hoverBorder: "group-hover:border-purple-500/50", dot: "bg-purple-500" },
}

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white overflow-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        className="w-full min-h-[95svh] flex flex-col items-center justify-center relative"
        style={{ backgroundImage: "url('/gifs/landing-page.gif')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            <span className="gradient-text-blue">Suraksha</span>{" "}
            <span className="text-white">AI</span>
          </h1>
          <p className="mt-4 text-2xl sm:text-3xl font-light text-white/70 tracking-tight">
            Hospital Security, Reimagined
          </p>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-white/55 leading-relaxed max-w-2xl">
            AI that watches over your entire hospital 24/7 — detecting aggression against doctors, staff negligence, missing infants, fire hazards, unauthorized access, and more.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5 items-center justify-center w-full">
            <Link 
              href="/surveillance" 
              className="relative group px-9 py-4 rounded-full font-bold text-white tracking-wide overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-[15px]">
                SURVILANCE
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              href="/library" 
              className="relative group px-9 py-4 rounded-full font-bold text-white tracking-wide overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5 text-[15px] text-white/90 group-hover:text-white">
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                DEMO
              </span>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex gap-10 sm:gap-16 text-center">
            {[
              { value: "99.7%", label: "Detection Accuracy", color: "text-blue-400" },
              { value: "24/7", label: "Live Monitoring", color: "text-cyan-400" },
              { value: "<3s", label: "Alert Response", color: "text-emerald-400" },
              { value: "8+", label: "Incident Types", color: "text-purple-400" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</span>
                <span className="text-xs text-white/50 whitespace-nowrap">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ─── INCIDENT DETECTION FEATURES ─────────────────────── */}
      <section id="detection" className="w-full py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-500/25 bg-blue-500/5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">AI-Powered Hospital Security</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Every Threat, <span className="gradient-text-blue">Instantly Detected</span>
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto">
              Purpose-built detection modules for all critical hospital security scenarios — from aggression to fire to missing infants.
            </p>
          </div>

          {/* Incident cards */}
          <div className="flex flex-col gap-28">
            {incidents.map((incident, idx) => {
              const c = colorMap[incident.color]
              const isReverse = incident.layout === "reverse"
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
                >
                  {/* Text */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isReverse ? "items-start md:items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-semibold ${c.badge}`}>
                        {incident.badge}
                      </div>
                      {incident.isNew && (
                        <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/60">NEW</span>
                      )}
                    </div>
                    <h3 className={`mt-4 text-3xl sm:text-4xl font-bold leading-tight ${isReverse ? "md:text-right" : ""}`}>
                      {incident.title}{" "}
                      <span className={c.title}>{incident.highlight}</span>
                    </h3>
                    <p className={`mt-4 text-white/55 text-base leading-relaxed max-w-md ${isReverse ? "md:text-right" : ""}`}>
                      {incident.desc}
                    </p>
                    <ul className={`mt-5 space-y-2 ${isReverse ? "md:items-end" : ""} flex flex-col`}>
                      {incident.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="w-full md:w-1/2">
                    <div className={`relative rounded-xl overflow-hidden group border ${c.border} ${c.hoverBorder} transition-colors duration-300`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <img
                        src={incident.gifSrc}
                        alt={incident.badge}
                        className="w-full aspect-video object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      />
                      {/* Alert chip */}
                      <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/75 border ${c.alert} px-3 py-1.5 rounded-lg backdrop-blur-sm`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${c.dot}`} />
                        <span className={`text-xs font-semibold ${c.alert.split(" ")[0]}`}>{incident.alertText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── HOSPITAL COVERAGE GRID ───────────────────────────── */}
      <section className="w-full py-24 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Full Hospital Coverage</h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">Every department, every corridor, every critical zone — monitored intelligently.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🚨", title: "Emergency Room",       desc: "Triage aggression, overcrowding, and rapid escalation.",           color: "hover:border-red-500/40" },
              { icon: "🏥", title: "General Wards",        desc: "Patient fall detection, nurse compliance, zone adherence.",         color: "hover:border-blue-500/40" },
              { icon: "👶", title: "Maternity / NICU",     desc: "Newborn perimeter security and infant movement tracking.",           color: "hover:border-pink-500/40" },
              { icon: "💊", title: "Pharmacy",             desc: "Drug access monitoring and controlled substance protection.",        color: "hover:border-purple-500/40" },
              { icon: "🔬", title: "ICU / Operation Theater", desc: "Strict zone enforcement, unauthorized entry blocked instantly.", color: "hover:border-cyan-500/40" },
              { icon: "🔥", title: "Kitchen / Labs",       desc: "Fire and smoke detected before it spreads — auto-evacuation.",       color: "hover:border-orange-500/40" },
              { icon: "🧹", title: "Staff Areas",          desc: "Duty compliance, sleeping detection, hygiene checks.",               color: "hover:border-yellow-500/40" },
              { icon: "🚪", title: "Entry & Exit Gates",   desc: "Visitor tracking, after-hours intruders, loitering alerts.",         color: "hover:border-emerald-500/40" },
              { icon: "🅿️", title: "Parking & Perimeter", desc: "Outdoor surveillance for ambulance bays and parking zones.",          color: "hover:border-neutral-400/40" },
            ].map(item => (
              <div key={item.title} className={`p-5 bg-neutral-900 border border-neutral-800 ${item.color} rounded-xl transition-all duration-200 group cursor-default`}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="w-full py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-500/25 bg-blue-500/5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">Suraksha AI — Hospital Grade</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-3">
            Your Doctors Deserve <span className="gradient-text">Protection.</span>
          </h2>
          <p className="text-2xl font-light text-white/60 mb-8">
            Your Patients Deserve <span className="text-blue-400">Safety.</span>
          </p>
          <p className="text-white/50 text-base mb-10 max-w-xl mx-auto">
            Deploy Suraksha AI across your hospital in minutes. Works with your existing CCTV — no new hardware required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="btn-primary px-8 py-3 text-base font-semibold">
              Deploy for Your Hospital
            </Link>
            <Link href="/surveillance" className="btn-secondary px-8 py-3 text-base font-semibold">
              View Live Demo
            </Link>
          </div>
          {/* Trust chips */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center text-white/40 text-xs">
            {["✓ HIPAA Compliant", "✓ No Hardware Needed", "✓ 24/7 Alert System", "✓ Multi-Model AI", "✓ Enterprise Ready"].map(t => (
              <span key={t} className="px-3 py-1 border border-white/10 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}