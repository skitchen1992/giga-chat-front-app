import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AssistantMessageProps {
  content: string;
  isPending: boolean;
}

export function AssistantMessage(props: AssistantMessageProps) {
  const { content, isPending } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-[85%] space-y-1">
      <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
        GigaChat
      </div>
      <div
        className={cn(
          "rounded-2xl rounded-tl-sm border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed",
          isPending && "text-muted-foreground"
        )}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Генерация ответа…
          </span>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>
      {!isPending && (
        <div className="flex justify-start px-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Копировать
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
