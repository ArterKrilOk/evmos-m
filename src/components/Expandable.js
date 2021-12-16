import React from "react";

class Expandable extends React.Component {
    state = {
        expanded: false
    }

    render() {
        if(!this.state.expanded) {
            return (
                <div style={this.props.style} className={this.props.closedClassName} onClick={() => this.setState({expanded: !this.state.expanded})}>
                    {this.props.closed()}
                </div>
            );
        }
        return (
            <div style={this.props.style} className={this.props.className} onClick={() => this.setState({expanded: !this.state.expanded})}>
                {this.props.children}
            </div>
        );
        
    }
};

export default Expandable;
