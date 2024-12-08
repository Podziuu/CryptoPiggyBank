import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0"
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0"
                }
            },
            async authorize(credentials, req) {
                try {
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
                    console.log(credentials, "CREDENTIALSS")
                    // @ts-ignore
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                    });

                    if (result.success) {
                        return {
                            id: siwe.address
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            session.address = token.sub;
            session.user.name = token.sub;
            return session;
        }
    }
})

export { handler as GET, handler as POST }