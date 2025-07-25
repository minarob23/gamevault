import styles from "./Cart.module.css";
import React from "react";
import { ReactComponent as Right } from "../../Resources/image/arrowRight.svg";
import { ReactComponent as Cross } from "../../Resources/image/cross.svg";
import { motion } from "framer-motion";
import AnimatedCart from "../../Containers/AnimatedPage/AnimatedCart";

const Cart = (props) => {
    const {
        cartAmount,
        cart,
        handleCloseCart,
        handleHover,
        hoverState,
        clearCart,
        handleRemoveFromCart,
        openGamePage,
    } = props;

    let newTotal = 0;
    cart.forEach((item) => {
        newTotal += parseFloat(item.price);
    });
    newTotal = newTotal.toFixed(2);


    const variants = {
        initial: { x: 100 },
        animate: {
            x: 0,
            transition: { x: { type: "spring", duration: 1.2, bounce: 0.4 } },
        },
        exit: {
            x: 100,
            transition: { x: { type: "spring", duration: 1.2, bounce: 0.575 } },
        },
    };

    return (
        <div className={styles.cartWindow}>
            <div className={styles.back} onClick={handleCloseCart}></div>
            <AnimatedCart>
                <div
                    className={styles.cart}
                    style={{ backgroundColor: "#1A1A1A", height: "100vh" }}
                >
                    <div className={styles.top}>
                        <div className={styles.topHeader}>
                            <h2>
                                {cartAmount >= 1
                                    ? cartAmount > 1
                                        ? `${cartAmount} games`
                                        : "1 game"
                                    : "No games added"}
                            </h2>
                            <h3 onClick={clearCart}>
                                {cartAmount >= 1 ? "Clear" : ""}
                            </h3>
                        </div>

                        <div className={styles.topGames}>
                            {cart.map((item, i) => {
                                return (
                                    <motion.div
                                        className={styles.item}
                                        key={i}
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    >
                                        <div className={styles.gameInfo}>
                                            <img
                                                src={item.cover}
                                                alt={item.name}
                                                className={styles.gameImage}
                                            />
                                            <h3
                                                id={item.surname}
                                                onClick={openGamePage}
                                            >
                                                {item.name}
                                            </h3>
                                        </div>
                                        <div>
                                            <span className={styles.price}>
                                                ${item.price}
                                            </span>
                                            <button
                                                id={item.id}
                                                onClick={handleRemoveFromCart}
                                                className={styles.removeButton}
                                                aria-label="Close"
                                            >
                                                <Cross
                                                    className={styles.cross}
                                                />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div
                        className={styles.bottom}
                        style={{
                            width: "87.5%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3>Total: ${newTotal}</h3>
                        <button
                            id="24"
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                            style={{
                                color: hoverState[24].hovered ? "#92f" : "#fff",
                            }}
                            aria-label="Checkout"
                            onClick={() => {
                                if (cart.length === 0) {
                                    alert(
                                        "Please add games to cart before checkout",
                                    );
                                } else {
                                    window.location.href = `/game-ecommerce-store/payment?items=${JSON.stringify(cart)}`;
                                }
                            }}
                        >
                            Checkout
                            <Right
                                className={styles.right}
                                style={{
                                    fill: hoverState[24].hovered
                                        ? "#92f"
                                        : "#fff",
                                }}
                            />
                        </button>
                    </div>
                </div>
            </AnimatedCart>
        </div>
    );
};

export default Cart;