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

          const user = await User.findOne({ email: credentials.email });

          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          ) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "buyer",
            provider: user.provider || "credentials",
            profile: user.profile || {},
            createdAt: user.createdAt || new Date(),
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
    maxAge: 30 * 24 * 60 * 60,
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
          } else {
            return false;
          }
        } else {
          if (account.provider !== "credentials") {
            user.role = existingUser.role;
            user.profile = existingUser.profile;
            user.createdAt = existingUser.createdAt;
            user.id = existingUser._id.toString();
          }
        }

        return true;
      } catch (err) {
        console.error("SignIn Error:", err);
        return false;
      }
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.sub = user.id || user._id?.toString();
        token.role = user.role || "buyer";
        token.provider = account?.provider || user.provider || "credentials";
        token.profile = user.profile || {};
        token.createdAt = user.createdAt || new Date();

        if (user.conversations) {
          token.conversations = user.conversations;
        }
      }

      if (trigger === "update" && token.sub) {
        try {
          await connectMongo();
          const updatedUser = await User.findById(token.sub);
          if (updatedUser) {
            token.role = updatedUser.role;
            token.profile = updatedUser.profile;
            token.conversations = updatedUser.conversations;
          }
        } catch (error) {
          console.error("Error updating token:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role || "buyer";
        session.user.provider = token.provider || "credentials";
        session.user.profile = token.profile || {};
        session.user.createdAt = token.createdAt || new Date();

        if (token.conversations) {
          session.user.conversations = token.conversations;
        }
      }

      return session;
    },
  },
};
