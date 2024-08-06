import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/database/dbConnect";
import User from "@/modals/UserModal";


export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // ...add more providers here
    ],
    callbacks:{
        async jwt({ token, user }) {
            // if (user) {
            //     token.id = user.id;
            //     token.username = user.username;
            //     token.isAdmin = user.isAdmin;
            //     token.image = user.image;
            //     token.name = user.name;
            // }
            // console.log("Token: ",token)
            // return token;
            return {...token, ...user}
        },

        async session({session, token, user}) {
            // console.log("Token: ",token)
            session.user.token = token;
            // if (user){
            //     session.user.mongoId = user.id;
            //     console.log("Session: ",session)
            //     console.log("UserSession: ", user)
            // }
            // session.user.gender="Male";

            // session.user.id = token.id;
            // session.user.username = token.username;
            // return session;
            // session.user = token;
            return session;

        },
        async signIn({user, account, profile}) {


            try{
                await connect();
                let userExists = await User.findOne({email: user.email});
                if(!userExists){
                    userExists = await User.create({
                        email: user.email,
                        username: await User.findOne({username:user.email.split("@")[0]}) ? user.email.split("@")[0] + Math.floor(Math.random() * 1000) : user.email.split("@")[0],
                        password: "123456",
                    });
                }


                user.id=userExists._id;
                user.username=userExists.username;
                user.email=userExists.email;

                return user;

            }catch (e) {
                console.log("Error while creating user: ",e)
                return false;
            }





        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}
