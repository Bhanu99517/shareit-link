# 🔗 ShareIt Link

> A fast, simple file-sharing web app — upload files and instantly share them via a link.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-shareit--link.vercel.app-blue?style=flat-square&logo=vercel)](https://shareit-link.vercel.app)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

---

## ✨ Features

- 📁 **Upload files** — Drag & drop or browse to upload any file
- 🔗 **Instant shareable links** — Get a link the moment your file is uploaded
- 🔐 **Google OAuth** — Sign in with your Google account
- 👤 **User dashboard** — View and manage all your uploaded files
- ☁️ **Cloud storage** — Files stored securely via Supabase Storage
- ⚡ **Fast & lightweight** — Built with Vite for near-instant load times
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth (Google OAuth) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+ or [Bun](https://bun.sh)
- A [Supabase](https://supabase.com) project
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))

### 1. Clone the repository

```bash
git clone https://github.com/Bhanu99517/shareit-link.git
cd shareit-link
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### 4. Set up Supabase

In your Supabase project:

1. **Create a storage bucket** named `files` (set to public or configure RLS as needed)
2. **Enable Google OAuth** under Authentication → Providers → Google
3. **Add your Google OAuth credentials** (Client ID & Secret) from Google Cloud Console
4. **Set redirect URL** in both Google Cloud Console and Supabase to:
   ```
   https://<your-domain>/auth/callback
   ```
5. **Create the required database tables** (files metadata, etc.) — refer to `/supabase` folder for migration files

### 5. Run locally

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
shareit-link/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── lib/            # Supabase client & utility functions
│   ├── hooks/          # Custom React hooks
│   └── main.tsx        # App entry point
├── supabase/           # Supabase migrations & config
├── index.html
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel's project settings
4. Deploy 🚀

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🔒 License

This project is proprietary software.

All rights reserved © 2026 Bhanu Prakash.

You are NOT allowed to use, copy, modify, or distribute this code without explicit permission.
---

## 👨‍💻 Author

**Bhanu** — [@Bhanu99517](https://github.com/Bhanu99517)

> Built with ❤️ using React, Supabase, and Vite.
