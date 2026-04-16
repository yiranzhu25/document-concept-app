// Comment thread — Addendum A11
import { useState, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from './Button'

export interface Comment {
  id: string
  authorName: string
  authorInitials: string
  body: string
  timestamp: string
}

interface CommentThreadProps {
  comments: Comment[]
  onAddComment: (text: string) => void
}

export function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const text = draft.trim()
    if (!text) return
    onAddComment(text)
    setDraft('')
  }

  // Cmd+Enter / Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Comment list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 8px' }}>
        {comments.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              textAlign: 'center',
              padding: '40px 24px',
              gap: '8px',
            }}
          >
            <MessageSquare
              size={32}
              strokeWidth={1.5}
              style={{ color: 'var(--color-text-placeholder)' }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
              }}
            >
              No Comments Yet
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Start the conversation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                <Avatar
                  initials={comment.authorInitials}
                  name={comment.authorName}
                  size={28}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {comment.authorName}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {comment.timestamp}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '13px',
                      color: 'var(--color-text-primary)',
                      lineHeight: '20px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky comment input */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-default)',
          paddingTop: '16px',
          flexShrink: 0,
        }}
      >
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment..."
          rows={3}
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '9px 12px',
            fontSize: '13px',
            lineHeight: '20px',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-2)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            transition: `border-color var(--duration-fast) var(--easing-standard)`,
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,70,185,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-default)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-placeholder)',
            }}
          >
            ⌘↵ to submit
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!draft.trim()}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )
}
