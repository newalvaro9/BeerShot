import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";
import type { ChangeEvent } from "react";
import styles from "@/styles/Upload.module.css";
import buttons from '@/styles/Buttons.module.css';
import Layout from "@/components/layout";

export default function Upload() {

    const [image, setImage] = useState<string | null>(null); // Image in base64
    const [imageName, setImageName] = useState<string | null>(null)
    const [imageSize, setImageSize] = useState<number>(0)

    const [progress, setProgress] = useState<number>(0);
    const [showBar, setShowBar] = useState<boolean>(false);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];

        if (!["image/svg+xml", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) return alert("You must upload a supported file type.")

        if (file) {
            setProgress(0);
            setShowBar(true)
            const reader = new FileReader();

            reader.onprogress = (event: ProgressEvent<FileReader>) => {
                if (event.lengthComputable) {
                    const loaded = Math.round((event.loaded / event.total) * 100);
                    setProgress(loaded)
                }
            };

            reader.readAsDataURL(file);

            reader.onload = () => {
                setProgress(100);
                setImage(reader.result as string);
                setImageName(file.name);
                setImageSize(file.size);
            };
        }
    };

    const handleUpload = async () => {
        if (image) {
            const data = {
                image: image,
                title: imageName,
                size: imageSize,
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    };

    useEffect(() => {
        const uploadIcon = document.getElementById('upload-icon');
        const textDrop = document.getElementById('text-drop');
        const previewImage = document.getElementById('preview-image');

        if (image && uploadIcon && previewImage && textDrop) {
            uploadIcon!.style.display = 'none';
            textDrop!.style.display = 'none';
            previewImage!.style.display = 'block';
        }
    }, [image])

    const handleClick = () => {
        const inputElement = document.getElementById('file-input');
        inputElement && inputElement.click();
    }

    return (
        <Layout title="Upload Images - BeerShoot">
            <h1 className={styles.title}>Upload to BeerShoot</h1>
            <div className={styles['box-upload']}>
                <div className={styles['upload-area']}>
                    <div id="drop-zone" className={styles['drop-zone']} onClick={handleClick}>
                        <Image src="/file.svg" id="upload-icon" alt="Upload file" width={60} height={70} />

                        {image && (
                            <Image src={image} alt="Preview Image" id="preview-image" className={styles['preview']} draggable="false" fill={true} />
                        )}

                        <p className={styles['text-drop']} id="text-drop">Drop your file here or click to browse</p>
                        <input type="file" id="file-input" accept="image/*" className="hide" onChange={handleFileSelect} />
                    </div>
                    {showBar && (
                        <div className={styles['loading-container']}>
                            <span className={styles['progress-percentage']} id="counter">{progress}%</span>
                            <div className={styles["loading-bar-back"]}>
                                <div className={styles["loading-bar-front"]} style={{ width: progress + '%' }}></div>
                            </div>
                        </div>
                    )}
                    <button type="button" onClick={handleUpload} className={`${styles["submit-input"]} ${buttons["button-3"]}`}>Upload file</button>
                </div>
            </div>

        </Layout >
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}