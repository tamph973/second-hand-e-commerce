# Second-Hand E-Commerce Platform with AI

A modern second-hand e-commerce platform built with React, Node.js, and AI-powered features for product moderation and user experience enhancement.

## ✨ Features

### User Management

-   **Authentication & Authorization**:

    -   Secure login with email/password
    -   Social login (Google, Facebook)
    -   Role-based access control (User, Seller, Admin)
    -   JWT token-based authentication
    -   Password reset functionality

-   **User Profiles**:
    -   Complete user profile management
    -   Address management with multiple addresses
    -   Avatar upload and management
    -   Personal information updates

### Seller Features

-   **Seller Verification System**:

    -   Multi-level verification (Basic, Advanced, Premium)
    -   CCCD/CMND verification with image processing
    -   Bank account verification
    -   Business information management
    -   Face verification capabilities

-   **Product Management**:
    -   Create, edit, and delete products
    -   Multiple product images and videos
    -   Product variants and attributes
    -   Inventory management
    -   Product condition classification

### Product Features

-   **AI-Powered Image Moderation**:

    -   Automatic content filtering
    -   Inappropriate content detection
    -   Product authenticity verification
    -   Google Cloud Vision integration

-   **Product Discovery**:

    -   Advanced search and filtering
    -   Category-based browsing
    -   Brand filtering
    -   Price range filtering
    -   Product condition filtering

-   **Product Details**:
    -   Rich product descriptions
    -   Multiple image galleries
    -   Video support
    -   User reviews and ratings
    -   Wishlist functionality

### Shopping Experience

-   **Shopping Cart**:

    -   Add/remove items
    -   Quantity management
    -   Cart persistence
    -   Price calculations

-   **Wishlist**:

    -   Save favorite products
    -   Wishlist management
    -   Share wishlist

-   **Order Management**:
    -   Complete checkout process
    -   Order tracking
    -   Order history
    -   Order status updates

### Payment Integration

-   **Multiple Payment Methods**:
    -   VNPay integration
    -   MoMo payment
    -   ZaloPay
    -   Bank transfer
    -   Cash on delivery

### Admin Features

-   **Dashboard**:

    -   Sales analytics
    -   User management
    -   Product moderation
    -   Order management

-   **Content Moderation**:
    -   Product approval system
    -   User verification management
    -   Report handling

### Real-time Features

-   **Socket.io Integration**:
    -   Real-time notifications
    -   Live chat support
    -   Order status updates
    -   Price change alerts

## 🛠 Tech Stack

### Frontend

-   **React 18** with Vite
-   **Redux Toolkit** for state management
-   **React Query** for server state management
-   **React Router DOM** for routing
-   **TailwindCSS** for styling
-   **Flowbite React** for UI components
-   **Framer Motion** for animations
-   **React Hook Form** with Yup validation
-   **Socket.io Client** for real-time features

### Backend

-   **Node.js** with Express.js
-   **MongoDB** with Mongoose ODM
-   **Redis** for caching and sessions
-   **JWT** for authentication
-   **Socket.io** for real-time communication
-   **Multer** for file uploads
-   **Cloudinary** for image storage
-   **Nodemailer** for email services
-   **Twilio** for SMS services

### AI & External Services

-   **Google Cloud Vision API** for image analysis
-   **TensorFlow.js** for client-side AI
-   **Google OAuth** for social login
-   **Facebook OAuth** for social login

### Payment Gateways

-   **VNPay** for Vietnamese payments
-   **MoMo** for mobile payments
-   **ZaloPay** for digital wallet

### Development Tools

-   **ESLint** for code linting
-   **Babel** for transpilation
-   **Nodemon** for development
-   **Morgan** for HTTP request logging

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── routes/        # Routing configuration
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Express middlewares
│   │   ├── configs/       # Configuration files
│   │   └── utils/         # Utility functions
│   └── docs/              # API documentation
├── data/                  # Sample data and mock files
└── screenshots/           # Application screenshots
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB
-   Redis
-   npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd secondhand-ecommerce-ai
    ```

2. **Install dependencies**

    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

3. **Environment Setup**

    Create `.env` files in both `server/` and `client/` directories with the following variables:

    **Server Environment Variables:**

    ```env
    BUILD_MODE=dev
    SERVER_PORT=8080
    SERVER_URL=http://localhost:8080
    FRONTEND_URL=http://localhost:5173
    MONGODB_URI=mongodb://localhost:27017/secondhand-ecommerce
    REDIS_HOST=localhost
    REDIS_PORT=6379
    JWT_SECRET_KEY=your-jwt-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-name
    CLOUDINARY_API_KEY=your-cloudinary-key
    CLOUDINARY_API_SECRET=your-cloudinary-secret
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    FACEBOOK_CLIENT_ID=your-facebook-client-id
    VNP_TMNCODE=your-vnpay-tmncode
    VNP_HASH_SECRET=your-vnpay-hash-secret
    MOMO_ACCESS_KEY=your-momo-access-key
    MOMO_SECRET_KEY=your-momo-secret-key
    TWILIO_ACCOUNT_SID=your-twilio-sid
    TWILIO_AUTH_TOKEN=your-twilio-token
    MAIL_ID=your-email
    MAIL_PW=your-email-password
    ```

4. **Start the development servers**

    ```bash
    # Start backend server
    cd server
    npm run dev

    # Start frontend server (in a new terminal)
    cd client
    npm run dev
    ```

5. **Access the application**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:8080

## 📸 Application Screenshots

**Login Page**
![Login](./screenshots/login.png)

## 🔧 Available Scripts

### Backend (server/)

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run production` - Start production server
-   `npm run lint` - Run ESLint

### Frontend (client/)

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## 🌟 Key Features

### AI-Powered Content Moderation

-   Automatic detection of inappropriate content
-   Product authenticity verification
-   Image quality assessment
-   Spam detection

### Advanced Search & Filtering

-   Full-text search across products
-   Category and brand filtering
-   Price range filtering
-   Product condition filtering
-   Location-based search

### Real-time Notifications

-   Order status updates
-   Price change alerts
-   New message notifications
-   System announcements

### Multi-vendor Support

-   Individual seller shops
-   Seller verification system
-   Commission management
-   Seller analytics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

-   **tamph973** - Initial work

## 🙏 Acknowledgments

-   Google Cloud Vision API for image analysis
-   Cloudinary for image storage
-   VNPay, MoMo, ZaloPay for payment integration
-   React and Node.js communities for excellent documentation
