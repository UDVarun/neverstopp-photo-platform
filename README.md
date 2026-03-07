# NeverStop - Premium Photo Platform

A full-stack Unsplash-style photo platform built with:

- React + Tailwind
- Node.js + Express
- Unsplash API
- JWT Authentication
- Razorpay Integration
- Smart Explore Algorithm

## Features

- Smart Explore Feed
- Infinite Scroll
- Image Preloading
- Blur Modal Animation
- Fullscreen Viewer
- Login & Signup
- Favorites
- Personal Library (upload your own images)
- Professional UI

## Auth Architecture

- Authentication is handled by Supabase on the frontend (`Login`, `Signup`, OAuth).
- Backend protected routes validate Supabase bearer tokens.
- Legacy custom JWT + local user auth has been removed to avoid dual-auth drift.

## Setup

1. Copy `.env.example` to `.env` and fill required values.
2. For frontend, set `VITE_RAZORPAY_KEY_ID` in `frontend/.env`.
3. For social auth, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env`.
4. In Supabase Auth provider settings, enable Google and GitHub, and add redirect URL:
   - `http://localhost:5173/`
   - your production domain root URL

### Backend

cd backend
npm install
npm start

### Frontend

cd frontend
npm install
npm run dev

## Security

- Follow `SECURITY.md` for reporting and baseline controls.
- Rotate all credentials if any secret has ever been committed.
