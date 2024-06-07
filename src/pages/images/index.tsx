import { useRouter } from "next/router";
import connect from "../../../lib/database/database";
import images from "../../../lib/database/models/images";
import { GetServerSideProps } from "next";

export default function Index({ newX }: { newX: Array<string> }) {

    const router = useRouter();

    return (
        <>
            {newX.map((x: string) => <h3 style={{ cursor: "pointer" }} key={x} onClick={() => router.push(`/images/${x}`)}>{x}</h3>)}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    await connect();
    const queriedimages = await images.find();
    const newX: Array<string> = [];

    queriedimages.forEach(x => {
        newX.push(x.link);
    });

    return {
        props: {
            newX
        }
    };
};