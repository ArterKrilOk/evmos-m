import React from "react";
import styles from "../styles/Button.module.css"

class Button extends React.Component {
    render() {
        return (
            <button
                style={this.props.style}
                className={`${styles.button} ${this.props.className}`}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export default Button;