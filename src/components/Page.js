import React from "react";

class Page extends React.Component {
    constructor(props) {
        super(props);
      }

    render() {
        return (
            <div style={{height: '100%', marginTop: '2rem'}}>
                {this.props.children}
            </div>
        );
    }
}
export default Page;