import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        let user = null;

        user = {
          id: 1,
          name: "John Doe",
        };

        if (!user) {
          return null;
        }
        return user;
      },
    }),
  ],

  pages: {
    signIn: "/log-in",
  },
};
