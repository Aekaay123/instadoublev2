import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {FirestoreAdapter} from "@auth/firebase-adapter"
import { app } from "@/firebase";

export const authOptions = {
   adapter: FirestoreAdapter(app),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();
      session.user.uuid = token.sub;
      return session;
    
    },
  },
};

const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
