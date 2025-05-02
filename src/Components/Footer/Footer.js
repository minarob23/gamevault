import React from "react";
import styles from "./Footer.module.css";
import { ReactComponent as Logo } from "../../Resources/image/logo.svg";
import { ReactComponent as GitHub } from "../../Resources/image/github.svg";
import { ReactComponent as LinkedIn } from "../../Resources/image/linkedin.svg";

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerContent}>
                <Logo className={styles.logo} />
                <h2 className={styles.title}>GameVault</h2>
                <p className={styles.subtitle}>
                    Your Gateway to Infinite Adventures
                </p>

                <div className={styles.socialLinks}>
                    <a
                        href="https://github.com/minarob23"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHub className={styles.socialIcon} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mina-robir-1392ab241/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <LinkedIn className={styles.socialIcon} />
                    </a>
                </div>

                <p className={styles.footerText}>
                    Designed and developed with ❤️ by{" "}
                    <a
                        href="https://github.com/minarob23"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.githubLink}
                    >
                        minarob23
                    </a>
                    . All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
