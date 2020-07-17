import React from "react";
import './MessagesSection.css'

class MessagesSection extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className="messages_section">
                <div className="message_block">
                    {this.props.messages.map(({ user, text, ava }, idx) => (
                        <div key={idx}
                            className={`message ${(user !== this.props.socket.id && user !== 'admin') ? 'other' : ''} ${(idx + 1) < this.props.messages.length && this.props.messages[idx + 1].user == this.props.messages[idx].user || user === 'admin' ? 'user_mess' : 'last_user_mess'}  ${user === 'admin' ? 'invite' : ''}`}>
                            {user !== 'admin' && user !== this.props.socket.id && <div className="user__icon on_mess"><span className={ava}></span></div>}
                            <div className="message__text">{text}</div>
                        </div>
                    ))}

                </div>
            </div>
        )
    }
}

export default MessagesSection;
