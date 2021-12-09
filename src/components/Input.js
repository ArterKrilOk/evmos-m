import React from "react";
import styles from '../styles/Input.module.css'

class Input extends React.Component {
    render() {
        return (
            <input
                pattern={this.props.pattern}
                min={this.props.min}
                step={this.props.step}
                style={this.props.style}
                onChange={event => this.props.onChange(event)}
                type={this.props.type}
                value={this.props.value}
                placeholder={this.props.placeholder}
                className={`${styles.input} ${this.props.className}`}>
                {this.props.children}
            </input>
        );
    }
};

export default Input;
