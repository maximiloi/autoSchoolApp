import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { company: true },
        });

        if (!user) throw new Error('Пользователь не найден');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Неверный пароль');

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.company?.id || null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
