import React, { Component } from "react";
import Loading from "../containers/loading_container";
import App from "../containers/app_container";
import Navbar from "../components/Navbar";
export default class IngestApp extends Component {
    componentWillMount() {
        return this.props
            .me()
            .then(() => this.props.connectSocket())
            .then(() => this.props.loaded())
            .then(() => this.props.onSocketDisconnected())
            .then(() => this.props.onSocketReconnecting())
            .then(() => this.props.onSocketReconnectSuccess())
            .then(() => this.props.onSocketReconnectFailure());
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <Navbar />
                {this.props.load.isActive ? <Loading /> : <App />}
            </div>
        );
    }
}
