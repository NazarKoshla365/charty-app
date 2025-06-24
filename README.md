
# 💬 Real-Time Chat App – Built with Next.js, TypeScript & Socket.IO

A modern, full-stack real-time chat application built using **Next.js 14 App Router**, **TypeScript**, **Socket.IO**, **MongoDB**, and **Tailwind CSS**.

This project showcases a simple but powerful messaging experience, including real-time updates, user authentication, and message persistence.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Language:** TypeScript
- **Realtime Engine:** Socket.IO
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **Auth:** JSON Web Tokens (JWT)
- **State Management:** React Hooks & Context
- **Other:** Zod (form validation), Bcrypt (password hashing)

---

## ✨ Features

- 🔒 User registration and login (JWT auth)
- 💬 Real-time 1-to-1 chat via Socket.IO
- 📦 Persistent chat history with MongoDB
- 🧾 Form validation with Zod
- 📱 Responsive layout (mobile & desktop)
- ⚡ Online user tracking
- 🧠 Clean project structure (modular & scalable)

---

## 📸 Preview

![Chat UI Preview](https://github.com/NazarKoshla365/chat-app-realtime-nextjs/blob/main/public/screenshot.png)

> _(Add your actual screenshot or replace this link when you push an image to `/public`)_

---

## 🔐 Authentication Logic

* Users register with email & password
* Passwords are hashed with Bcrypt
* JWT is generated on login and stored in cookies
* Protected routes check JWT validity

---

## 🔄 Realtime Communication

* Socket.IO is used to emit and listen for messages
* Messages are broadcast between sender and receiver in real-time
* Messages are also stored in MongoDB for persistence

---

## 📌 Possible Improvements

* [ ] Add group chat support
* [ ] Add typing indicators
* [ ] Add message read status
* [ ] Add emoji/file sharing
* [ ] Improve message UI with animations

---
