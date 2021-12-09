import React from "react";
import styles from '../styles/Input.module.css'

class TextArea extends React.Component {
    render() {
        return (
            <textarea
                rows={this.props.rows}
                onChange={event => this.props.onChange(event)}
                style={this.props.style}
                placeholder={this.props.placeholder}
                value={this.props.value}
                className={`${styles.input} ${this.props.className}`}>
                {this.props.children}
            </textarea>
        );
    }
};

export default TextArea;