import React from "react";
import './VideCallArea.css'

class VideCallArea extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <React.Fragment>
                <div className='videoCall_window__bg'></div>
                <div className='videoCall_window'>
                    <div className='inner'>
                        <video autoPlay playsInline muted ref={this.props.userVideo} className='userVideo'></video>
                        <video autoPlay playsInline ref={this.props.recipVideo} className='recipVideo'></video>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default VideCallArea;


