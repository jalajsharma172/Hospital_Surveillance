"use client"

import Link from "next/link"
import { BarChart2, Zap, Video, PlaySquare, FolderOpen, Menu, Shield } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/surveillance", label: "Monitor",   icon: BarChart2,  badge: null },
  { href: "/upload",       label: "Upload",    icon: Video,      badge: null },
  { href: "/realtime",     label: "Live Feed", icon: PlaySquare, badge: "LIVE" },
  { href: "/library",      label: "demo",      icon: FolderOpen, badge: null },
]

export function HeaderNav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop Navigation ─────────────────────────────────────── */}
      <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const isLive = item.badge === "LIVE"
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  relative flex items-center gap-2 px-3.5 py-2 rounded-md transition-all duration-200 group
                  ${isActive
                    ? "text-white bg-white/8"
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"
                  }
                `}
              >
                <item.icon
                  className={`h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200
                    ${isActive ? "text-blue-400" : "text-neutral-600 group-hover:text-neutral-400"}
                  `}
                />
                <span className="text-[10px] font-medium tracking-[0.12em] uppercase hidden lg:inline" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span className={`
                    px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm leading-none
                    ${isLive
                      ? "bg-red-500/15 text-red-400 border border-red-500/25 animate-pulse"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }
                  `}>
                    {item.badge}
                  </span>
                )}

                {/* Active underline indicator */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-3 h-[1.5px] bg-gradient-to-r from-blue-500 to-blue-400/0 rounded-full" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* ── Mobile Navigation ──────────────────────────────────────── */}
      <div className="flex md:hidden items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-neutral-400 hover:text-neutral-200 hover:bg-white/8 rounded-md"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-52 bg-[#09090b]/95 backdrop-blur-xl border border-white/8 text-neutral-400 p-1.5 rounded-xl shadow-2xl"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isLive = item.badge === "LIVE"
              return (
                <DropdownMenuItem
                  key={item.href}
                  asChild
                  className="focus:bg-white/6 focus:text-neutral-100 p-0 rounded-lg"
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-lg transition-colors ${isActive ? "text-white bg-white/6" : ""}`}
                  >
                    <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-blue-400" : "opacity-40"}`} />
                    <span className="flex-1 text-[10px] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm leading-none ${isLive ? "bg-red-500/15 text-red-400 border border-red-500/25" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
