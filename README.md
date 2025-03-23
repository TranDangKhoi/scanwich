# Scanwich

Scanwich is a Next.js-powered dining solution that lets customers order food seamlessly. Just QR scan, browse, and place your order in seconds!

## Overview

Scanwich is a modern restaurant ordering system that streamlines the dining experience. Customers can simply scan a QR code at their table to access the menu, place orders, and track their order status in real-time.

## Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **QR Code** - For generating QR codes
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling
- **Shadcn UI** - For UI components
- **React Query** - For server state management
- **React Hook Form** - For form handling
- **Zod** - For schema validation
- **Lucide React** - For icons
- **Socket.IO Client** - For real-time features (future features)
- **Zustand** - For state management (future adjustment)

### Backend

- **Node.js** - Runtime environment
- **Fastify** - Web framework
- **Prisma** - ORM
- **SQLite** - Database
- **Socket.IO** - For real-time features

## Key Features

- 🔐 JWT-based Authentication & Role-based Authorization
- 🌙 Theme switching with next-themes
- 📱 Fully responsive design with Tailwind CSS
- 🎨 Modern UI components with Shadcn UI
- 🔄 Real-time order updates via Socket.IO
- 📝 Type-safe forms with React Hook Form & Zod
- 🚀 Server state management with React Query
- 📊 Order tracking and management system
- 🔍 Comprehensive order history
- 📱 QR code scanning for table identification
- 💾 Persistent data storage with Prisma & SQLite
- 🔄 Future state management with Zustand

## Getting Started

Umm, I'll get to that. Probably there'll never be a start because you have no access to API keys.

## Stuffs that can be improved

- Improve Avatar selection UX
- Client-side image file restrictions (file size, file type, ...e.t.c) and "maybe" we can make an avatar crop function
- Improve Password field UX (create a show password function)
- Improve overall look for the dashboard/accounts route
- Refactor the Tanstack Query logic to a seperated useHook file
- Use Tanstack Virtual to virtualize the account table (and other tables)
- Better authentication logic -> Maybe switch to the old logic that I've been familiar with: Call refresh token API only when receive a 401 error and it's token expired error, and for the tokens inside cookie, we keep the current logic
- More settings for setting page, use Ctrl + K to navigate, ...e.t.c
- Use react-use for the useKeyboard hook -> require owner to use a combined keys to delete an account
- > And more...
