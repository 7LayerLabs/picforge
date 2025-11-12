import * as React from 'react'

interface FeedbackEmailProps {
  name?: string
  email?: string
  category: 'bug' | 'idea' | 'praise' | 'other'
  rating: number
  message: string
  submittedAt: string
  userAgent?: string
  ip?: string
}

export default function FeedbackEmail(props: FeedbackEmailProps) {
  const { name, email, category, rating, message, submittedAt, userAgent, ip } = props
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h2 style={{ margin: '0 0 16px', color: '#0f766e' }}>New Feedback Submission</h2>
      <table cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 640 }}>
        <tbody>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>Submitted At</td>
            <td style={{ color: '#111827' }}>{new Date(submittedAt).toLocaleString()}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>Category</td>
            <td style={{ color: '#111827', textTransform: 'capitalize' }}>{category}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>Rating</td>
            <td style={{ color: '#111827' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>Name</td>
            <td style={{ color: '#111827' }}>{name || '—'}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>Email</td>
            <td style={{ color: '#111827' }}>{email || '—'}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151', verticalAlign: 'top' }}>Message</td>
            <td style={{ color: '#111827', whiteSpace: 'pre-wrap' }}>{message}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>User Agent</td>
            <td style={{ color: '#6b7280' }}>{userAgent || '—'}</td>
          </tr>
          <tr>
            <td style={{ width: 140, color: '#374151' }}>IP</td>
            <td style={{ color: '#6b7280' }}>{ip || '—'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


