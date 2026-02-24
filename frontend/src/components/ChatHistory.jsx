import { useState } from 'react'
import { FiArrowLeft, FiClock, FiTrash2 } from 'react-icons/fi'
import MessageBubble from './MessageBubble'

const formatDate = (ts) =>
  new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

// ============ Full session conversation viewer ============
const SessionView = ({ session, onBack }) => (
  <div className="space-y-3">
    {/* Header row */}
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-emerald-600"
      >
        <FiArrowLeft size={14} />
        Back
      </button>
      <div className="ml-auto text-right">
        <p className="text-sm font-semibold text-slate-800">{session.label}</p>
        <p className="text-xs text-slate-400">{formatDate(session.startedAt)}</p>
      </div>
    </div>

    {/* Messages */}
    <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      {session.messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </div>
  </div>
)

// ============ Session list ============
const ChatHistory = ({ history, onClear }) => {
  const [viewing, setViewing] = useState(null)

  // Always show the latest version of the session (may have been updated after clicking)
  if (viewing) {
    const latest = history.find((s) => s.id === viewing.id) || viewing
    return <SessionView session={latest} onBack={() => setViewing(null)} />
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        No chat history yet. Upload an image to start a session.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {history.length} session{history.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
        >
          <FiTrash2 size={12} />
          Clear all
        </button>
      </div>

      {/* Session cards */}
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {history.map((session) => (
          <button
            key={session.id}
            onClick={() => setViewing(session)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">{session.label}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <FiClock size={11} />
                  {formatDate(session.startedAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {Math.round(session.confidence * 100)}%
                </span>
                <span className="text-xs text-slate-400">
                  {session.messages.length} msg{session.messages.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatHistory
