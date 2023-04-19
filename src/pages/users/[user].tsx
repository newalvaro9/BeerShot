import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Layout from "@/components/layout";

import Image from "next/image";

import styles from '@/styles/Users.module.css'
import buttons from '@/styles/Buttons.module.css';

import connect from "../../../lib/database/database";
import users from "../../../lib/database/models/users";
import images from "../../../lib/database/models/images";


interface Props {
    userinfo: any;
    imageCollection: Array<{ [keyof: string]: any }>;
    watchingMyProfile: boolean;
}

export default function Profile({ userinfo, imageCollection, watchingMyProfile }: Props) {

    return (
        <Layout>
            <div className={styles["div-user"]}>
                {
                    userinfo.avatar ? (
                        <Image
                            src={userinfo.avatar}
                            className={styles['avatar-user']}
                            alt={"Avatar"}
                            width={150}
                            height={150}
                            draggable={false}
                        />
                    ) : (
                        <Image
                            src={"https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
                            className={styles['avatar-user']}
                            alt={"Avatar"}
                            width={150}
                            height={150}
                            draggable={false}
                        />
                    )
                }

                <div className={styles["username-bio"]}>
                    <h1 className={styles['username']}>{userinfo.username}</h1>

                    {userinfo.biography ? (
                        <p>{userinfo.biography}</p>
                    ) : (
                        watchingMyProfile ? (
                            <p>You do not have a biography.</p>
                        ) : (
                            <p>This user does not have a biography.</p>
                        )
                    )}
                </div>
            </div>

            <hr className={styles["separator"]} style={{ marginTop: '5px', marginBottom: '7px' }} />

            <div className={styles["container-of-cards"]}>
                {
                    Array.isArray(imageCollection) && imageCollection.length > 0 ? (
                        imageCollection.map(image => (

                            <div className={styles["cs-card"]} key={image.link}>
                                <h3 className={styles["cs-title"]} title={image.title}>{image.title}</h3>

                                <a href={`/images/${image.link}`} target="_blank">
                                    <div className={styles["cs-card-image"]}>
                                        <Image
                                            src={image.image}
                                            className={styles['image']}
                                            alt={image.title}
                                            width={200}
                                            height={200}
                                            draggable={false}
                                        />
                                    </div>
                                </a>
                            </div>

                        ))
                    ) : (
                        watchingMyProfile ? (
                            <h2>You do not have any images</h2>
                        ) : (
                            <h2>This user does not have any images</h2>
                        )
                    )
                }
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    await connect();

    const user = await users.findOne({ userid: context?.params?.user });
    if (!user) {
        return {
            props: {
                redirect: {
                    destination: "/404",
                    permanent: false,
                },
            }
        }
    }

    const imagesDB = await images.find({ publisher: context?.params?.user });

    let imageCollection: Array<{ [keyof: string]: any }> = [];

    imagesDB.forEach(image => {
        const binaryData = image.image.buffer; // Get the buffer
        const imageBase64 = Buffer.from(binaryData, 'base64').toString('utf-8');

        imageCollection.push({
            link: image.link,
            title: image.title,
            image: imageBase64,
            size: image.size,
            date: image.date,
            publisher: image.publisher,
        })
    })

    const session = await getSession(context);
    const watchingMyProfile = (session?.user as any)?.userid == context?.params?.user;

    return {
        props: {
            userinfo: {
                email: user.email,
                username: user.username,
                avatar: user.avatar || null,
                biography: user.biography || null
            },
            imageCollection: imageCollection,
            watchingMyProfile: watchingMyProfile,
        }
    }
}