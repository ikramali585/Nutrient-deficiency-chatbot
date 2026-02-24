import { useState } from 'react'
import { RiRobot2Line } from 'react-icons/ri'
import ChatHistory from './ChatHistory'
import MessageBubble from './MessageBubble'

const ChatBox = ({ messages, onSend, loading, loadingSeconds = 0, chatHistory = [], onClearHistory }) => {
  // ===========input + tab state================
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('chat')

  // =======Sends current message to parent callback===========
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    onSend?.(input)
    setInput('')
  }

  const historyLabel = chatHistory.length > 0 ? `History (${chatHistory.length})` : 'History'

  return (
    // ==========Chat wrapper=================
    <div className="space-y-3">
      {/* ========Tab bar========= */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {historyLabel}
        </button>
      </div>

      {/* ========History tab======== */}
      {activeTab === 'history' ? (
        <ChatHistory history={chatHistory} onClear={onClearHistory} />
      ) : (
        <>
          {/* Message list */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {/* ======Empty state====== */}
            {messages.length === 0 && !loading ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Upload a rice crop image to start a conversation with AgriBot.
              </p>
            ) : null}

            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} message={message} />
            ))}

            {/* ========Bot typing indicator ==========*/}
            {loading ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
                  <RiRobot2Line size={15} />
                </div>
                <div className="max-w-fit rounded-lg bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span className="ml-1 text-xs text-slate-500">Typing {loadingSeconds}s</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/*========= Message composer============== */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about nutrient deficiency..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default ChatBox
