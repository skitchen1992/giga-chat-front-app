## Features

- [Vite 6](https://vitejs.dev) с [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org) и [absolute imports](https://github.com/aleclarson/vite-tsconfig-paths).
- [Tailwind CSS v4](https://tailwindcss.com) для стилизации.
- [Biome V2](https://next.biomejs.dev) для линтинга и форматирования.
- [Feature-Sliced Design](https://feature-sliced.design/) — архитектура проекта.

## Feature-Sliced Design (FSD)

Структура проекта организована по методологии FSD. Слои (сверху вниз):

```
src/
├── app/          # Инициализация приложения
├── pages/        # Страницы
├── widgets/      # Виджеты
├── features/     # Фичи (действия пользователя)
├── entities/     # Бизнес-сущности
└── shared/       # Переиспользуемый код
```

### Куда что класть

| Слой | Путь | Что класть |
|------|------|------------|
| **app** | `src/app/` | Инициализация приложения, провайдеры (Router, Theme, Query), глобальные стили, точка входа `main.tsx` |
| **pages** | `src/pages/` | Страницы приложения. Каждая страница — композиция виджетов и фич. Пример: `home/`, `profile/` |
| **widgets** | `src/widgets/` | Композитные блоки для страниц. Состоят из entities и features. Пример: `header/`, `sidebar/`, `chat-list/` |
| **features** | `src/features/` | Действия пользователя, интерактивность. Пример: `auth/`, `send-message/`, `toggle-theme/` |
| **entities** | `src/entities/` | Бизнес-сущности. Пример: `user/`, `message/`, `chat/` |
| **shared** | `src/shared/` | Код без бизнес-логики: `ui/` (кнопки, инпуты), `lib/` (утилиты), `api/` (клиент), `config/`, `types/` |

### Структура слайса (entities, features, widgets)

```
feature-name/
├── ui/           # Компоненты
├── model/        # Стейт, сторы, бизнес-логика
├── api/          # Запросы к API
├── lib/          # Хелперы слайса
├── config/       # Конфиг слайса
└── index.ts      # Public API — экспорт наружу только отсюда
```

### Правила импорта

- Слой может импортировать только из слоёв **ниже** (pages → widgets → features → entities → shared).
- Импорт только через **Public API** (`index.ts`), не напрямую в файлы слайса.
- Алиасы: `@/app`, `@/pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`.

## Getting started

```
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — dev-сервер с hot reload.
- `pnpm build` — сборка для production.
- `pnpm preview` — превью production-сборки.
- `pnpm test` — unit-тесты.
- `pnpm test:e2e` — e2e тесты (Playwright).
- `pnpm format` — форматирование (Biome).
- `pnpm lint` — TypeScript + Biome.
