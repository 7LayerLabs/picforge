'use client'

type Props = {
  url?: string
  title?: string
  className?: string
}

export default function SocialButtons({ url, title, className }: Props) {
  const shareUrl = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : 'https://pic-forge.com'))
  const text = encodeURIComponent(title || 'Check out PicForge — (re)imagine everything')

  return (
    <div className={className || ''}>
      <div className="flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:opacity-90"
        >
          Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:opacity-90"
        >
          Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg bg-sky-700 text-white text-xs font-semibold hover:opacity-90"
        >
          LinkedIn
        </a>
        <button
          onClick={async () => {
            const link = decodeURIComponent(shareUrl)
            try {
              await navigator.clipboard.writeText(link)
              alert('Link copied!')
            } catch {
              window.prompt('Copy this link', link)
            }
          }}
          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-300"
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}


