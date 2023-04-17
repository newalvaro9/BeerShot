import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import connect from "../../../lib/database/database";
import users from "../../../lib/database/models/users";

export default function Profile({ userinfo }) {
    return (

    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    await connect();

    const user = await users.findOne({ email: session?.user?.email })
    if(!user) 

    return {
        props: {

        }
    }
}