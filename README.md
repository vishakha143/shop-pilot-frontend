# ShopPilot Frontend

User-facing frontend for **ShopPilot**, an AI-powered e-commerce platform.  
This application allows users to browse products, manage carts, place orders, and interact with the platform securely.

## 🚀 Live Demo
(To be added after deployment)

## 🛠 Tech Stack
- React
- Vite
- CSS
- Axios
- React Router
- Vercel (Deployment)

## ✨ Features
- User registration and login
- Product browsing and search
- Cart management
- Order placement and updating
- Secure authentication using HTTP-only cookies
- Responsive UI for desktop and mobile

## 🔗 Backend Integration
This frontend communicates with the ShopPilot backend API for:
- Authentication
- Product data
- Cart and order operations

Backend URL is configured via environment variables.

## ⚙️ Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://shoppilot-backend-i22e.onrender.com
