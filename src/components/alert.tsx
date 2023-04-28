import styles from '@/styles/Alert.module.css';

type Props = {
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

export default function Alert({ error, setError }: Props) {
    return (
        <>
            {error && (
                <div className={styles['alert']} >
                    <span className={styles['closebtn']} onClick={() => setError("")}>&times;</span>
                    {error}
                </div>
            )}
        </>
    )
}