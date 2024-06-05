import { signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react";
import styles from '@/styles/Navbar.module.css'
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();

    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false)
    const [showNavbarResponsive, setShowNavbarResponsive] = useState<boolean>(false)

    const dropdownRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleHamburguer = () => {
        setShowNavbarResponsive(prev => !prev)
    }

    const toggleProfile = () => {
        setShowProfileMenu(prev => !prev)
    }

    return (
        <nav id='navbar' className={`${styles["navbar"]} ${styles["navbar-expand-lg"]}`}>
            <div className={`${styles["container-fluid"]}`}>
                <Link href="/" className={styles["navbar-brand"]}>BeerShot</Link>
                <button type="button" className={styles["navbar-toggler"]} onClick={toggleHamburguer}>
                    <span className={styles["navbar-toggler-icon"]}></span>
                </button>
                <div className={`${styles['collapse']} ${styles['navbar-collapse']} ${showNavbarResponsive && styles['show']}`} id="navbarCollapse">
                    <div className={`${styles['navbar-nav']} ${styles['ms-auto']}`}>
                        <Link href="/" className={styles["nav-link"]}>Home</Link>
                        {session ? (
                            <>
                                <Link href="/upload" className={styles["nav-link"]}>Upload</Link>

                                <li className={styles["dropdown"]}>
                                    <button className={`${styles['nav-link']} ${styles['dropdown-toggle']}`} onClick={toggleProfile}>
                                        {(session.user as any).username}
                                    </button>
                                    {showProfileMenu && (
                                        <ul className={styles["dropdown-menu"]} ref={dropdownRef}>
                                            <li><Link className={styles["dropdown-item"]} href="/users">Profile</Link></li>
                                            <li>
                                                <hr className={styles["dropdown-divider"]} />
                                            </li>
                                            <li><button className={`${styles["dropdown-item"]} ${styles['logout']}`} onClick={() => signOut()}>Log out</button></li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register" className={styles["nav-link"]}>Register</Link>
                                <Link href="/auth/login" className={styles["nav-link"]}>Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    )
}