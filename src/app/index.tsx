import { ChevronDown, Pencil, Plus, Rocket, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatInput from "@/features/send-message/ui/ChatInput/ChatInput";

export function App() {
  return (
    <div className="flex h-screen bg-background">
      {/* Шапка */}
      <header className="fixed top-0 left-0 right-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-muted" />
          <span className="text-sm font-medium">ChatGPT Auto</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
        <button
          type="button"
          className="size-8 rounded-full border border-border"
          aria-label="Профиль"
        />
      </header>

      {/* Боковая панель */}
      <aside className="fixed left-0 top-12 z-10 flex h-[calc(100vh-3rem)] w-64 flex-col border-r border-border bg-sidebar">
        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Button variant="outline" className="mb-3 w-full justify-start gap-2">
            <Pencil className="size-4" />
            Новый чат
          </Button>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Поиск в чатах" className="pl-9" />
          </div>

          <div className="mt-4 flex-1 overflow-auto">
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">
              Недавнее
            </p>
            <ul className="space-y-0.5">
              {[
                "Shadcn/ui c React",
                "Конкурентный анализ прод...",
                "Работа с shadcn/ui",
                "Использование ref в React",
                "Конкурентный анализ сайта",
                "Конкурентный анализ прод....",
                "Документация GET запросов",
                "Запуск FastAPI",
                "Способы создания образа",
                "Node.js Version Incompatibility",
              ].map((title, i) => (
                <li key={title + i}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-sidebar-accent"
                  >
                    <span className="truncate">{title}</span>
                    <Rocket className="size-4 shrink-0 opacity-50" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Никита Лаврентьев</p>
              <p className="truncate text-xs text-muted-foreground">
                Рабочая область Никита Лаврентьев
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Основная область */}
      <main className="ml-64 flex flex-1 flex-col pt-12">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
          <h2 className="mb-8 text-2xl font-medium">Готов, когда ты готов.</h2>
          <ChatInput />
        </div>

        <footer className="py-4 text-center">
          <p className="text-xs text-muted-foreground">
            ChatGPT может допускать ошибки. OpenAI не использует данные рабочей
            области Рабочая область Никита Лаврентьев для обучения своих
            моделей.
          </p>
        </footer>
      </main>
    </div>
  );
}
