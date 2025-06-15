# E-Commerce Platform with RFQ & Chat System

This is a Next.js e-commerce platform with real-time chat and Request for Quote (RFQ) functionality built using Socket.io.

## Features

- **Real-time Chat System**: Integrated Socket.io for real-time communication between buyers and sellers
- **RFQ System**: Buyers can request quotes for products, and sellers can respond with pricing
- **Quote Management**: Track quote requests and their statuses
- **Conversation Management**: Organized conversations by product and request type

## Getting Started

First, install the dependencies:

```bash
npm install
```

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

### RFQ Flow

1. Buyer views a product and requests a quote by specifying quantity
2. System creates an RFQ and a conversation between buyer and seller
3. Seller receives the RFQ notification and can view it in their dashboard
4. Seller submits a quote which gets sent as a message in the conversation
5. Buyer receives the quote and can continue the conversation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
