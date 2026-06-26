import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  streaming?: boolean;
}

const components: Components = {
  code({ node: _node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const inline = !match;
    return inline ? (
      <code className="bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>
        {children}
      </code>
    ) : (
      <SyntaxHighlighter
        style={oneDark as Record<string, React.CSSProperties>}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: "0.75rem 0",
          borderRadius: "8px",
          fontSize: "0.8rem",
          background: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },
};

export function MarkdownRenderer({ content, className = "", streaming = false }: MarkdownRendererProps) {
  return (
    <div className={`prose-dark ${streaming ? "streaming-cursor" : ""} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
