import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, Plus } from "lucide-react";

function ChatInput() {
  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="relative flex items-center rounded-xl border border-input bg-muted/30 px-4 py-3">
        <Button
          variant={null}          
					size="icon-sm"
          aria-label="Добавить"
        >
          <Plus className="size-5 text-muted-foreground" />
        </Button>

        <Textarea
          placeholder="Спросите ChatGPT"
          rows={2}
          className="min-h-0 flex-1 resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <Button
          variant="default"
          size="icon-sm"
          aria-label="Отправить"
          className="rounded-full"
        >
          <ArrowUpIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
