import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/Button'
import { useIsMobile } from '../hooks/useIsMobile'

/* ── Clearmark logo: pen/nib glyph + wordmark ── */
function ClearmarkLogo({ glyphSize = 56 }: { glyphSize?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <svg
        width={glyphSize}
        height={glyphSize}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--ink)', flexShrink: 0 }}
        aria-hidden="true"
      >
        <path d="M42.6668 21.3333L5.3335 58.6667" />
        <path d="M46.6668 40H24.0002" />
        <path d="M53.9735 32.64C56.9757 29.6377 58.6624 25.5658 58.6624 21.32C58.6624 17.0742 56.9757 13.0022 53.9735 9.99999C50.9712 6.99774 46.8993 5.3111 42.6535 5.3111C38.4077 5.3111 34.3357 6.99774 31.3335 9.99999L13.3335 28V50.6667H36.0002L53.9735 32.64Z" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--weight-semi)' as any,
          letterSpacing: 'var(--track-tight)',
          color: 'var(--ink)',
          lineHeight: 1,
        }}
      >
        Clearmark
      </span>
    </div>
  )
}

export function WelcomePage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'var(--surface-1)',
        padding: isMobile ? 'var(--space-8) var(--space-6)' : 'var(--space-10)',
        gap: isMobile ? 'var(--space-8)' : 'var(--space-10)',
        animation: 'pageIn var(--dur-slow) var(--ease-out)',
      }}
    >
      <ClearmarkLogo glyphSize={isMobile ? 48 : 56} />

      <div
        style={{
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <p
          style={{
            fontSize: isMobile ? 'var(--text-base)' : 'var(--text-md)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--ink-2)',
            margin: 0,
          }}
        >
          This demo recreates the core workflow of the AI loan review tool I designed at
          Goldman Sachs — no real data or systems involved. I made it mobile-friendly for
          easy exploring (the real product is desktop-only) and built a custom design
          system to show what I'd do with full creative freedom. Still evolving as I go.
        </p>
      </div>

      <Button
        size="lg"
        onClick={() => navigate('/projects')}
        style={{ paddingLeft: 'var(--space-6)', paddingRight: 'var(--space-6)' }}
      >
        Explore
        <ArrowRight size={18} strokeWidth={2} />
      </Button>
    </div>
  )
}
