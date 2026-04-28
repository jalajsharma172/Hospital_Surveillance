'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function HomeLink() {
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    router.push(user ? '/protected' : '/')
  }

  return (
    <Link 
      href="/" 
      onClick={handleClick}
      className="flex items-center gap-2 group"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md group-hover:scale-105 transition-all overflow-hidden border border-white/10 shadow-lg">
        <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm font-bold tracking-tight text-neutral-100 font-mono">SURAKSHA</span>
        <span className="text-sm font-bold tracking-tight text-blue-400 font-mono">AI</span>
      </div>
    </Link>
  )
}
