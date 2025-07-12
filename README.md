# 🧠 StackIt – A Minimal Yet Intelligent Q&A Platform

StackIt is a modern, community-driven Q&A platform built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). Inspired by platforms like Stack Overflow, StackIt brings in a simplified yet intelligent question-answering experience with a clean, human-first UI and a unique AI-powered assistant.

> 💡 Designed and built in under 24 hours during the Odoo Hackathon 2025 🚀

---

## 📌 Features Overview

### ✅ Core Features

- 🔐 **User Authentication**
  - Register/Login with role-based access (User/Admin)
  - Secured with JWT

- 📝 **Ask Questions with Rich Text**
  - Rich text editor (using React Quill)
  - Supports formatting: bold, italic, lists, links, and code blocks
  - Tag selector for easy categorization

- 💬 **Answer System**
  - Users can post rich-text formatted answers
  - Each question can have multiple answers
  - Real-time sorting by votes

- ⬆️ **Voting System**
  - Upvote/downvote answers to promote best solutions
  - One user = one vote per answer

- ✅ **Accepted Answers**
  - Question authors can mark one answer as accepted
  - Visually highlighted for clarity

- 🔔 **Notification System**
  - Users receive alerts for:
    - New answers on their questions
    - Mentions using `@username`
    - Accepted answers

- 🏷️ **Tagging + Filters**
  - Users can tag questions
  - Filter by tags for relevant searches

- 👨‍💼 **Admin Dashboard**
  - View & moderate reported questions/answers
  - Delete inappropriate content
  - Export user & content stats (CSV)

---

## 🌟 Unique Features (Our Winning Edge 💥)

### 🤖 AI Chatbot Assistant (In-App Guide)
- Smart helper on "Ask a Question" page
- Suggests:
  - Similar existing questions
  - Tag recommendations
  - Draft rephrasing assistance
- Enhances UX for new users
- Powered by:
  - Rule-based logic (offline fallback)
  - OpenAI integration (if API key provided)

### ⭐ Reputation System
- Dynamic score assigned to every user
- Points awarded for:
  - +10: Upvotes on answers
  - +5: Accepted answers
  - -2: Downvotes
- Reputation shown on profile & post cards
- Encourages meaningful contributions
- Future Scope: Badges & tiered privileges

---

## 📁 Project Structure

```bash
root/
├── client/                 # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── App.jsx
│
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
├── .env
└── README.md
