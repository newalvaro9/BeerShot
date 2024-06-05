import Layout from '@/components/layout';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import styles from '@/styles/Image.module.css'

import connect from '../../../lib/database/database';
import images from '../../../lib/database/models/images';
import formatBytes from '../../../utils/formatBytes';
import formatDate from '../../../utils/formatDate';

type ImageProps = {
    title: string;
    image: string;
    size: number;
    date: number;
    publisher: number;
}

export default function ImageRoute({ image }: { image: ImageProps }) {
    return (
        <Layout title={`${image.title} - BeerShot`}>
            <h1 className={styles['title']}>BeerShot Images</h1>
            <h2 className={styles['img-title']}>{image.title}</h2>

            <div className={styles['box']}>
                <div className={styles['img-container']}>
                    <div className={styles['img-div']}>
                        <Image src={image.image} alt={image.title} fill={true} draggable={false} />
                    </div>
                </div>
                <div className={styles['image-info']}>
                    <span>{formatDate(image.date)}</span>
                    <span>{formatBytes(image.size)}</span>
                </div>
            </div>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    await connect();

    const image = await images.findOne({ link: params?.image });
    if (!image) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            }
        };
    }
    const binaryData = image.image.buffer; // Get the buffer
    const imageBase64 = Buffer.from(binaryData, 'base64').toString('utf-8');

    return {
        props: {
            image: {
                title: image.title,
                image: imageBase64,
                size: image.size,
                date: image.date,
                publisher: image.publisher,
            },
        },
    };
}