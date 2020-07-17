import React from "react";
import './ChatHeader.css'

class ChatHeader extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className="chat__header">
                <div className="title">Чат</div>
                <div className="right_block">
                    <div className="blue_button" onClick={this.props.blueButtonClick}>Получить ссылку на комнату</div>
                    <div className={`room_link ${this.props.show_link ? '' : 'hidden'}`}>{`http://localhost:3000/login/${this.props.roomId}`}</div>
                    <div className="users" onClick={this.props.showListToggle } />
                    <div className={`users_list ${this.props.show_users_list ? '' : 'hidden'}`}>
                        {this.props.users.map((user, idx) =>
                            <div className='user_list_user' key={idx}>
                                <div className="user__icon ">
                                    <span className={user.ava}></span>
                                </div>
                                <span>{user.name}</span>
                                {user.id == this.props.socket.id
                                    ? <span className="cant_call_yself"></span>
                                    : <span onClick={(e) => this.props.videoCallClick(e, user.id) } className="call_icon"></span>
                                }
                            </div>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatHeader;
