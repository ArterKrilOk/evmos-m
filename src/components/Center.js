import React from "react";
import styles from "../styles/Center.module.css"

class Center extends React.Component {
    render() {
        if(this.props.horizontal) {
            return (
                <div style={this.props.style} className={styles.centerHorizontal}>
                    {this.props.children}
                </div>
            );
        }
        return (
            <div style={this.props.style} className={styles.center}>
                {this.props.children}
            </div>
        );
        
    }
};

export default Center;
