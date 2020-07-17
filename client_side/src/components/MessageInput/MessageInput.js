import React from "react";
import './MessageInput.css'

class MessageInput extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className="input_message">
                <div className="input_message__block">
                    <input type="text" name="" placeholder="Введите сообщение..."
                        value={this.props.value}
                        onChange={this.props.onChange}
                        onKeyPress={this.props.onKeyPress}
                    />
                    <span className="send_message" onClick={this.props.onClick}></span>
                </div>
            </div>
        )
    }
}

export default MessageInput;
