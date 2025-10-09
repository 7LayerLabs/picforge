'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Clock, Sparkles, ArrowLeft } from 'lucide-react'

const EditorNSFW = dynamic(() => import('../components/EditorNSFW'), {
  ssr: false
})

export default function EditorNSFWPage() {
  return <EditorNSFW />
}

