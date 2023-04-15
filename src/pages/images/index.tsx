export default function Index() {
    return <></>
}

export const getServerSideProps = () => {
    return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }
}