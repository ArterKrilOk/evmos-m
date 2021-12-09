import React from "react";
import styles from '../styles/Progress.module.css'


class ProgressBar extends React.Component {

    render() {
        if(!this.props.progress) {
            return (
                <div className={styles.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            );
        }
        return (
            <div className={styles.container} style={{}}>
                <div className={styles.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <br></br>
                <b className={styles.text}>{Number((this.props.value).toFixed(0))}%</b>
            </div>
        );
    }
}

export default ProgressBar;