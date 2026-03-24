import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, FileText, Loader2, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import selector from "./selector";
import { addFile, clearFiles, removeFile } from "../../model/attachmentStore";
import {
  addAttachment,
  clearAttachments,
  removeAttachment,
  resetMessage,
  sendMessage,
  setMessage,
} from "../../model/slice";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/shared/lib";

function ChatInput() {
  const { message, attachments } = useAppSelector(selector);
  const dispatch = useAppDispatch();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const id = addFile(file);
        dispatch(addAttachment({ id, name: file.name, size: file.size }));
      });
    },
    noClick: true, // не открывать диалог по клику
    noKeyboard: true, // не открывать по клавише
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".tiff", ".bmp"],
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/epub+zip": [".epub"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const isLoading = false;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setMessage(e.target.value));
  };

  const handleSend = () => {
    dispatch(sendMessage(message));
    dispatch(resetMessage());
    dispatch(clearAttachments());
    clearFiles();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((message.trim() || attachments.length > 0) && !isLoading) {
        handleSend();
      }
    }
    if (e.key === "Escape") {
      dispatch(resetMessage());
    }
  };

  const handleRemoveAttachment = (id: string) => () => {
    removeFile(id);
    dispatch(removeAttachment(id));
  };

  return (
    <div className="w-full max-w-2xl space-y-3" {...getRootProps()}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate max-w-[180px]" title={attachment.name}>
                {attachment.name}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {formatFileSize(attachment.size)}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Удалить вложение"
                onClick={handleRemoveAttachment(attachment.id)}
                className="shrink-0 -mr-1 -my-1"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div
        className={cn(
          "relative flex items-center rounded-xl border px-4 py-3 transition-colors",
          isDragReject && "border-destructive bg-destructive/10",
          isDragAccept && "border-primary bg-primary/10",
          !isDragActive && "border-input bg-muted/30"
        )}
      >
        <Button
          variant={null}
          size="icon-sm"
          aria-label="Добавить"
          onClick={open}
        >
          <Plus className="size-5 text-muted-foreground" />
        </Button>
        <input {...getInputProps()} />
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Спросите GigaGhat"
          rows={1}
          className="min-h-0 flex-1 resize-none overflow-y-auto max-h-[40vh] border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <Button
          onClick={handleSend}
          variant="default"
          size="icon-sm"
          aria-label="Отправить"
          className="rounded-full"
          disabled={(!message.trim() && attachments.length === 0) || isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ArrowUpIcon className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
