import { GetServerSideProps } from "next"
import { ChangeEvent, useEffect, useRef, useState } from "react";
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

    const [showOverlayBio, setShowOverlayBio] = useState<boolean>(false)
    const [showOverlayAvatar, setShowOverlayAvatar] = useState<boolean>(false)
    const [newImage, setNewImage] = useState<string>("")

    const [userAvatar, setUserAvatar] = useState<string>(userinfo.avatar || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg")
    const [userBio, setUserBio] = useState<string | null>(userinfo.biography || null)

    const useRefNewBiography = useRef<HTMLTextAreaElement>(null)

    const toggleOverlayVisibility = (overlay: string) => {
        if (overlay === 'bio') {
            setShowOverlayBio(prev => !prev)
        }
        else if (overlay === 'avatar') {
            setShowOverlayAvatar(prev => !prev)
        }
    }

    const closeOverlay = (overlay: string) => {
        if (overlay === 'bio') {
            setShowOverlayBio(false)
        }
        else if (overlay === 'avatar') {
            setShowOverlayAvatar(false)
        }
    }

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];

        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) return alert("You must upload a supported file type.");

        if (file) {
            if (file.size > 2_000_000) return alert("Your image must not exceed 2mb size");
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                setNewImage(reader.result as string);
            };
        }
    };

    const handleChangeBio = () => {
        const data = {
            newBio: useRefNewBiography!.current!.value
        };

        fetch('/api/editbio', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setShowOverlayBio(false)
                    setUserBio(useRefNewBiography!.current!.value)
                } else {
                    alert("There was an error setting your biography");
                }
            })
            .catch(error => {
                alert("There was an error setting your biography");
            });
    }

    const handleChangeAvatar = () => {
        const data = {
            newAvatar: newImage
        };

        fetch('/api/editavatar', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setShowOverlayAvatar(false)
                    setUserAvatar(newImage)
                } else {
                    alert("There was an error sending your image");
                }
            })
            .catch(error => {
                alert("There was an error sending your image");
            });
    }

    const dragElement = (elmnt: HTMLElement, elmnt2: HTMLElement) => {
        if (!elmnt || !elmnt2) return
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt2.onmousedown = dragMouseDown;

        function dragMouseDown(e: MouseEvent) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    if (typeof window !== 'undefined') {
        const overlayBio = document.getElementById("overlay-bio");
        const headerDragBio = document.getElementById("header-drag-bio");
        const overlayAvatar = document.getElementById("overlay-avatar");
        const headerDragAvatar = document.getElementById("header-drag-avatar");

        if (overlayBio && headerDragBio && overlayAvatar && headerDragAvatar) {
            dragElement(overlayBio, headerDragBio);
            dragElement(overlayAvatar, headerDragAvatar);
        }
    }

    return (
        <Layout>

            <div
                style={{ display: showOverlayBio ? 'block' : 'none' }}
                className={styles['overlay-bio']}
                id="overlay-bio"
            >
                <Image src="/drag.svg" alt="drag" className={styles["drag-overlay-btn"]} id="header-drag-bio" draggable="false" width={15} height={15} />
                <a className={styles["close-overlay-btn"]} onClick={() => closeOverlay('bio')}>&times;</a>

                <h4>Biography</h4>
                <textarea
                    placeholder="I am 23 years old..."
                    defaultValue={userinfo.biography || undefined}
                    name="bio"
                    id="bio"
                    maxLength={280}
                    ref={useRefNewBiography}
                />
                <button type="button" className={buttons["button-2"]} style={{ width: '100%' }} onClick={handleChangeBio}>Change biography</button>
            </div>

            <div
                style={{ display: showOverlayAvatar ? 'block' : 'none' }}
                className={styles['overlay-avatar']}
                id="overlay-avatar"
            >
                <Image src="/drag.svg" alt="drag" className={styles["drag-overlay-btn"]} id="header-drag-avatar" draggable="false" width={15} height={15} />
                <a className={styles["close-overlay-btn"]} onClick={() => closeOverlay('avatar')}>&times;</a>

                <h4>Avatar</h4>
                <input id="avatar" name="avatar" type="file" accept=".jpg, .jpeg, .png" onChange={handleFileSelect} />
                <button type="button" className={buttons["button-2"]} style={{ width: '100%' }} onClick={handleChangeAvatar}>Change avatar</button>
            </div>


            <div className={styles["div-user"]}>

                <Image
                    src={userAvatar}
                    className={styles['avatar-user']}
                    alt={"Avatar"}
                    width={150}
                    height={150}
                    draggable={false}
                />

                <div className={styles["username-bio"]}>
                    <h1 className={styles['username']}>{userinfo.username}</h1>

                    {userBio ? (
                        <p>{userBio}</p>
                    ) : (
                        watchingMyProfile ? (
                            <p>You do not have a biography.</p>
                        ) : (
                            <p>This user does not have a biography.</p>
                        )
                    )}
                </div>
            </div>

            {watchingMyProfile && (
                <div className={styles["div-edits"]}>
                    <button className={buttons["button-2"]} id="edit-avatar" onClick={() => toggleOverlayVisibility('avatar')}>Change avatar</button>
                    <button className={buttons["button-2"]} id="edit-bio" onClick={() => toggleOverlayVisibility('bio')}>Change biography</button>
                </div>
            )}

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
            redirect: {
                destination: "/404",
                permanent: false,
            },
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

    let imageBase64 = null;
    if (user.avatar) {
        const binaryData = user.avatar.buffer; // Get the buffer
        imageBase64 = Buffer.from(binaryData, 'base64').toString('utf-8');
    }

    return {
        props: {
            userinfo: {
                email: user.email,
                username: user.username,
                avatar: imageBase64,
                biography: user.biography || null
            },
            imageCollection: imageCollection,
            watchingMyProfile: watchingMyProfile,
        }
    }
}