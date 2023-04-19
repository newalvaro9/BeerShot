import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

export default () => (<></>)

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    return {
        redirect: {
            destination: (session?.user as any)?.userid ? `/users/${(session?.user as any).userid}` : '/',
            permanent: false,
        }
    }
}