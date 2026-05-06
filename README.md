# 🏪 Kisii Secondhand Market

> A modern student marketplace for Kisii University — buy and sell secondhand items safely within the campus community.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwindcss)

## ✨ Features

- 🛍️ **Browse & Search** — Search listings by keyword or category
- 📦 **List Items** — Sell your secondhand goods with photos
- 💬 **Real-time Chat** — Message sellers directly
- 💰 **Make an Offer** — Negotiate prices through built-in price offers
- 🔔 **Notifications** — In-app + email alerts for messages
- ❤️ **Save Items** — Bookmark listings for later
- 🛡️ **Admin Dashboard** — Manage users, listings, and reports
- 🌙 **Dark / Light Mode** — Theme toggle with persistent preference
- 📱 **Mobile Responsive** — Full bottom navigation for mobile

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma 7 |
| **Auth** | Custom JWT (jose) + bcryptjs |
| **Email** | Nodemailer (Gmail) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Themes** | next-themes |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/kisii-secondhand.git
cd kisii-secondhand
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run database migrations

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin dashboard
│   ├── browse/           # Browse listings
│   ├── messages/         # Chat system
│   ├── product/[id]/     # Product detail
│   ├── sell/             # List an item
│   └── api/              # API routes
├── components/           # Reusable UI components
└── lib/
    ├── actions/          # Server actions
    ├── auth.ts           # Authentication helpers
    └── prisma.ts         # Prisma client
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`. **Never commit your `.env` file.**

## 👨‍💻 Developer

**Erick Mutua** — 3rd Year Computer Science Student, Kisii University  
📧 erickmutua150@gmail.com | 📱 0706546644

---

*Built for the Kisii University student community.*
