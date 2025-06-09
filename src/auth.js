import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectMongo();

          // Find user
          const user = await User.findOne({ email: credentials.email });

          // If no user found or password doesn't match
          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          ) {
            return null;
          }

          // Return user data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            profile: user.profile,
            createdAt: user.createdAt,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/log-in",
    error: "/log-in",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongo();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          if (account.provider !== "credentials") {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
              role: "buyer",
              profile: {
                phone: "",
                company: "",
                whatsapp: "",
                address: "",
                country: "",
                website: "",
                description: "",
              },
              favProducts: [],
              favSellers: [],
              reviews: [],
              rfqs: [],
              purchaseHistory: [],
              conversations: [],
            });
            console.log(`Created new ${account.provider} user: ${user.email}`);
          } else {
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error("SignIn Error:", err);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id || user._id?.toString();
        token.role = user.role;
        token.provider = account?.provider || user.provider || "credentials";
        token.profile = user.profile;
        token.createdAt = user.createdAt;

        if (user.conversations) {
          token.conversations = user.conversations;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.profile = token.profile;
        session.user.createdAt = token.createdAt;

        if (token.conversations) {
          session.user.conversations = token.conversations;
        }
      }
      return session;
    },
  },
};
