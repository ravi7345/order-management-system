# Frontend Architecture

Feature-based React structure optimized for DRY, testability, and separation of concerns.

## Folder structure

```text
src/
├── api/                 # HTTP client + resource-specific API modules
├── components/
│   ├── layout/          # App shell, page header
│   └── ui/              # Reusable UI primitives (Button, DataTable, FormField…)
├── constants/           # Shared copy (toast messages)
├── context/             # Global providers (inventory data, notifications)
├── features/            # Domain modules (dashboard, products, customers, orders)
├── hooks/               # Reusable React hooks (useForm, useAsync, useMutation…)
├── styles/              # Global CSS tokens and layout
└── utils/               # Pure helpers (formatting, validation, error parsing)
```

## Data flow

1. `InventoryProvider` loads products, customers, orders, and dashboard via `useAsync`.
2. Feature sections consume data with `useInventory()`.
3. Mutations use `useInventoryMutation()` for API call + toast + refresh in one place.
4. `NotificationProvider` handles success/error toasts globally.

## DRY building blocks

| Layer | Responsibility |
|-------|----------------|
| `api/client.js` | Single fetch wrapper + error normalization |
| `useForm` | Controlled fields, validation, touched state |
| `useInventoryMutation` | Mutation + refresh + notification |
| `DataTable` | Column-driven tables |
| `FormField` / `SelectField` | Accessible labeled inputs |

## Feature module pattern

Each domain under `features/<name>/` contains:

- `*.constants.js` — initial form state
- `*.validators.js` — client-side validation
- `*Form.jsx` — create/update UI
- `*Table.jsx` — list + actions
- `*Section.jsx` — composes form + table inside `Card`
