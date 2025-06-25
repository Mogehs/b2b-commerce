# B2B E-Commerce Platform

A comprehensive B2B e-commerce platform built with Next.js, featuring real-time chat, Request for Quote (RFQ) system, multi-role dashboards, and supplier management capabilities.

## 🚀 Features

### Core Functionality

- **Multi-Role System**: Support for Buyers, Sellers, and Administrators
- **Product Management**: Complete product catalog with categories and detailed listings
- **Store Management**: Seller store profiles with business information
- **Real-time Chat System**: Socket.io powered messaging between buyers and sellers
- **RFQ System**: Request for Quote functionality with quote management
- **Supplier Directory**: Browse and connect with verified suppliers

### Authentication & Security

- **NextAuth.js Integration**: Secure authentication system
- **OAuth Support**: Google and Facebook login integration
- **Email Verification**: OTP-based email verification system
- **Password Reset**: Secure password reset with email OTP
- **Role-based Access Control**: Different permissions for different user roles

### Dashboard Features

- **Admin Dashboard**: User management, seller applications, system overview
- **Buyer Dashboard**: Order history, RFQ management, supplier connections
- **Seller Dashboard**: Product management, store profile, sales analytics, RFQ responses

### Technical Features

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Image Management**: Cloudinary integration for image uploads
- **Map Integration**: Mapbox for location services
- **Email System**: SMTP email notifications and communications
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Maps**: Mapbox
- **UI Components**: Custom components with shadcn/ui

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd commerece
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory. Use `.env.example` as a template:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/b2b-commerece

# Authentication
AUTH_SECRET=your-auth-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running on your system, then start the development server:

```bash
npm run dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── components/        # Page-specific components
│   │   ├── dashboard/         # Dashboard pages
│   │   └── ...
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── models/                # MongoDB models
│   └── middleware.js          # Next.js middleware
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── .env.example              # Environment template
└── package.json              # Dependencies
```

## 🔐 User Roles & Permissions

### Buyer

- Browse products and suppliers
- Send RFQ requests
- Chat with sellers
- Manage purchase history

### Seller

- Create and manage store profile
- Add and manage products
- Respond to RFQ requests
- Chat with buyers
- View sales analytics

### Admin

- Manage all users
- Approve seller applications
- System-wide analytics
- Content moderation

## 🔄 Key Workflows

### RFQ Process

1. Buyer browses products and requests a quote
2. System creates RFQ and notifies seller
3. Seller reviews RFQ in dashboard
4. Seller provides quote through chat system
5. Buyer receives quote and can negotiate
6. Agreement reached and order processed

### Seller Onboarding

1. User registers as seller
2. Submits seller application with business details
3. Admin reviews and approves application
4. Seller gains access to seller dashboard
5. Seller sets up store profile and adds products

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/rfq/*` - RFQ system
- `/api/user/*` - User management
- `/api/seller/*` - Seller operations
- `/api/admin/*` - Admin functions
- `/api/conversations/*` - Chat system

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:

- Update `MONGODB_URI` for production database
- Set `NEXT_PUBLIC_SOCKET_URL` to your production URL
- Configure SMTP settings for email
- Update OAuth redirect URLs for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Contact: [mugheesurrehman06@gmail.com](mailto:mugheesurrehman06@gmail.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Socket.io for real-time capabilities
- MongoDB for the database solution
- All the open-source libraries that made this project possible
