import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiUser } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'

// Tailwind-styled markdown element map
const mdComponents = {
  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-1 list-disc space-y-0.5 pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="my-1 list-decimal space-y-0.5 pl-4">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  // Collapse heading levels to styled inline text to keep bubbles compact
  h1: ({ children }) => <p className="font-bold">{children}</p>,
  h2: ({ children }) => <p className="font-bold">{children}</p>,
  h3: ({ children }) => <p className="font-semibold">{children}</p>,
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">{children}</code>
  ),
}

const MessageBubble = ({ message }) => (
  <div
    className={`flex w-full items-start gap-3 ${
      message.role === 'user' ? 'flex-row-reverse justify-end' : 'justify-start'
    }`}
  >
    {/* Avatar */}
    <div
      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        message.role === 'user' ? 'bg-green-500 text-white' : 'bg-green-700 text-white'
      }`}
    >
      {message.role === 'user' ? <FiUser size={15} /> : <RiRobot2Line size={15} />}
    </div>

    {/* Bubble */}
    <div
      className={`w-fit max-w-[85%] break-words rounded-lg px-3 py-2 text-sm text-slate-800 shadow-sm ${
        message.role === 'user' ? 'ml-auto bg-slate-200 text-right' : 'bg-white text-left'
      }`}
    >
      {message.role === 'bot' ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {message.text}
        </ReactMarkdown>
      ) : (
        message.text
      )}
    </div>
  </div>
)

export default MessageBubble
