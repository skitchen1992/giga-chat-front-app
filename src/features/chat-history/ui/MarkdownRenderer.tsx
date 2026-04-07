import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

const components: Components = {
	code({ className, children, ...props }) {
		const match = /language-(\w+)/u.exec(className ?? "")
		const codeString = String(children).replace(/\n$/u, "")

		if (match) {
			return (
				<SyntaxHighlighter
					className="rounded-lg text-xs"
					language={match[1]}
					PreTag="div"
					style={oneDark}
				>
					{codeString}
				</SyntaxHighlighter>
			)
		}

		return (
			<code
				className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
				{...props}
			>
				{children}
			</code>
		)
	}
}

interface MarkdownRendererProps {
	content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
	return (
		<ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
			{content}
		</ReactMarkdown>
	)
}
