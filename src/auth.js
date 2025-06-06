import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
        if (!credentials.email || !credentials.password) return null;

        await connectMongo();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/log-in",
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
            });
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

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
