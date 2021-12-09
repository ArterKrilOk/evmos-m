import React from "react";
import Center from "../components/Center";
import ProgressBar from "../components/Progress";
import Page from '../components/Page'


class HomePage extends React.Component {
    render() {
        return (
            <Page>
                <Center>
                {/* <input type="text" placeholder="some text" className="input"/> */}
                    <ProgressBar />
                </Center>
            </Page>
        );
    }
};

export default HomePage;