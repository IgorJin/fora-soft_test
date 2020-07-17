import React from "react";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import queryString from 'query-string';
import io from "socket.io-client";
let socket;

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            redirect: false, 
            name: '', 
            roomId: '',
            messages: [], 
            users: [], 
            rooms: [], 
            show_users_list: false, 
            message: '', 
            sendindMess: false,
            videoCalling: false,
            stream: {} 
        };

        this.sendMessage = this.sendMessage.bind(this)
        this.videoCall = this.videoCall.bind(this)

        this.userVideo = React.createRef()
        this.recipVideo = React.createRef()
    }
    sendMessage(e) {
        e.preventDefault();
        if (this.state.message) {
            this.setState({sendindMess : true})
            socket.emit('sendMessage', this.state.message);
            this.setState({message : ''})
        }
    }
    videoCall(e, recipientId){
        this.setState({videoCalling : true})
        console.log(recipientId)
        console.log(navigator);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            console.log(stream)
            //this.setState(stream);
            
            // if (userVideo.current) {
            //   userVideo.current.srcObject = stream;
            // }
          })
    }

    componentDidMount() {
        const { name, roomId } = queryString.parse(this.props.location.search);
        this.setState({ name, roomId })
        if (!name) this.setState({ redirect: true })
        else{
            socket = io('http://localhost:3001')
            socket.emit('join', { name, roomId })

            socket.on('inviteMessage', (message)=>{
                this.setState({messages: [...this.state.messages, message]})
            })
            
            socket.on('message', (message)=>{
                this.setState({sendindMess : false})
                this.setState({messages: [...this.state.messages, message]})
            })
    
            socket.on('usersInDaRoom', ({users})=>{
                this.setState({users})
            })
    
            socket.on('userJoin', (message)=>{
                this.setState({messages: [...this.state.messages, message]})
            })
            
            socket.on('roomsInDaChat', ({rooms})=>{
                this.setState({rooms})
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
    }
    componentWillUnmount(){
        socket.emit('disconnect');
        socket.off();
    }

    render() {
        if (this.state.redirect) return <Redirect to='/login/join' />

        return (
            <div className='body'>
                {this.state.videoCalling && 
                <React.Fragment>
                    <div className='videoCall_window__bg'></div>
                    <div className='videoCall_window'>
                        <div className='inner'>
                            <video autoPlay playsInline muted ref={this.userVideo} className='userVideo'></video>
                            <video autoPlay playsInline ref={this.recipVideo} className='recipVideo'></video>
                        </div>
                    </div>
                </React.Fragment>
                }
                <div className="leftbar">
                    <div className="search">
                        <input type="text" name="search" placeholder="Поиск" />
                        <span className="search__icon"></span>
                    </div>
                    <div className="rooms_list">
                        {this.state.rooms.map(( room, idx )=>
                            <div key={idx} className={`room_card ${room.id === this.state.roomId ?'active' : ''}`}>
                                <a href={`/?name=${this.state.name}&roomId=${room.id}`}>
                                    <div className="user__icon "><span className={room.ava}></span></div>
                                    <div className="room_card__name">{room.roomName}</div>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="chat">
                    <div className="chat__header">
                        <div className="title">Чат</div>
                        <div className="right_block">
                            <div className="copy_link">Получить ссылку на комнату</div>
                            <div className="users" onClick={()=>{this.setState({show_users_list: !this.state.show_users_list})}} />
                            <div className={`users_list ${this.state.show_users_list ? '' : 'hidden'}`}>
                                {this.state.users.map(( user, idx )=> 
                                <div className='user_list_user' key={idx}>
                                    <div className="user__icon ">
                                        <span className={user.ava}></span>
                                    </div> 
                                    <span>{user.name}</span> 
                                    <span onClick={(e)=>this.videoCall(e, user.id)} className="call_icon"></span>
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <div className="messages_section">
                        <div className="message_block">
                            {this.state.messages.map(({ user, text, ava }, idx)=> (
                                <div key={idx} 
                                    className={`message ${user != socket.id && user !== 'admin' && 'other'} ${(idx+1) < this.state.messages.length && this.state.messages[idx+1].user == this.state.messages[idx].user || user==='admin' ? 'user_mess' : 'last_user_mess'}  ${user == 'admin' && 'invite'}`}>
                                    { user!=='admin' && user!=socket.id && <div className="user__icon on_mess"><span className={ava}></span></div> }
                                    <div className="message__text">{text}</div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="input_message">
                        <div className="input_message__block">
                            <input type="text" name="" placeholder="Введите сообщение..." 
                            value={this.state.message}
                            onChange={({ target: { value } }) => this.setState({message: value})}
                            onKeyPress={e => e.key === 'Enter' ? this.sendMessage(e) : null}
                            />
                            <span className="send_message" onClick={e => this.sendMessage(e)}></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;