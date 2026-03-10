import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const providers: any[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // 1. Validation de la présence des identifiants
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      // 2. Recherche de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      // 3. Vérification si l'utilisateur existe ET possède un mot de passe (cas des comptes Google/GitHub)
      if (!user || !user.password) {
        return null;
      }

      // 4. Comparaison sécurisée avec bcrypt (on force le type string)
      const passwordMatches = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (!passwordMatches) {
        return null;
      }

      // 5. Retour des données pour la session
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

const authInstance = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut, auth } = authInstance;