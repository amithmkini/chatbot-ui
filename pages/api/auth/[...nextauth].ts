import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { getDataSource, getUser } from '../../../utils/server/rdbms';

const providers = [];
if (process.env.GOOGLE_CLIENT_ID) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      // Needed to be able to select a different google accounts each time.
      authorization: {
        params: {
          prompt: 'login',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  );
}
if (process.env.GITHUB_CLIENT_ID) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  );
}
if (process.env.CREDENTIALS) {
  providers.push(
    CredentialsProvider({
      name: 'Chatbot UI',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials === null || credentials === undefined) {
          return null;
        }
        const dataSource = await getDataSource();
        const user = await getUser(dataSource, credentials.username);
        // If this is a new user, then the password would be null. Create
        // a new user with the password.
        if (user.pass === null || user.pass === undefined) {
          user.pass = credentials.password;
          await dataSource.manager.save(user);
        }
        // Check the password here
        if (user.pass === credentials.password) {
          return {
            id: user.id, name: user.id, email: user.id
          }
        }
        await dataSource.destroy();
        return null;
      }
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers: providers,
  session: { strategy: 'jwt' },
};

export default NextAuth(authOptions);
