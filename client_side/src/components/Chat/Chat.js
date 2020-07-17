import React from "react";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import Peer from "simple-peer"
import queryString from 'query-string';
import io from "socket.io-client";
import MessageInput from '../MessageInput/MessageInput'
import MessagesSection from '../MessagesSection/MessagesSection'
import ChatHeader from '../ChatHeader/ChatHeader'
import Leftbar from '../Leftbar/Leftbar'
import VideCallArea from '../VideCallArea/VideCallArea'

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
            stream: {},
            receivingCall: false,
            caller: {},
            callerSignal: {},
            callerName: ''
        };

        this.sendMessage = this.sendMessage.bind(this)
        this.videoCall = this.videoCall.bind(this)
        this.callPeer = this.callPeer.bind(this)
        this.acceptCall = this.acceptCall.bind(this)
        
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

    callPeer(id){
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: this.state.stream,
        });

        peer.on("signal", data => {
            socket.emit("callUser", { to: id, signalData: data, from: socket.id })
        })

        peer.on("stream", stream => {
            if (this.recipVideo.current) {
                this.recipVideo.current.srcObject = stream;
            }
        });

        socket.on("callAccepted", signal => {
            peer.signal(signal);
        })
    }

    async acceptCall() {
        this.setState({videoCalling : true})
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        this.setState({stream});
        if (this.userVideo.current) {
            this.userVideo.current.srcObject = stream;
        }

        console.log(this.state.stream, 'ACCEPT')

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: this.state.stream,
          });
          peer.on("signal", data => {
            console.log(data, 'to', socket.id);
            socket.emit("acceptCall", { signal: data, to: this.state.caller })
          })
      
          peer.on("stream", stream => {
            console.log('stream', stream);
            this.recipVideo.current.srcObject = stream;
          });

          peer.signal(this.state.callerSignal);
    }

    async videoCall(e, recipientId){
        this.setState({videoCalling : true})
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        this.setState({stream});
        if (this.userVideo.current) {
            this.userVideo.current.srcObject = stream;
        }

        this.callPeer(recipientId)

        

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

            socket.on("outgoing", (data) => {
                this.setState({receivingCall:true, caller: data.from, callerSignal: data.signal, callerName: data.fromName})
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
    }
    componentWillUnmount(){
        if (socket){
            socket.emit('disconnect');
            socket.off();
        }
    }

    render() {
        if (this.state.redirect) return <Redirect to='/login/join' />
        let incomingCall;
        if (this.state.receivingCall && !this.state.videoCalling) {
            incomingCall = (
                <React.Fragment>
                <div className='videoCall_window__bg'></div>
                    <div className='videoCall_window'>
                    <div className='inner_text'>
                        <div>
                            <h1>Вам звонит <span>{this.state.callerName}</span></h1>
                            <button className='blue_button' onClick={this.acceptCall}>Принять вызов</button>
                        </div>
                    </div>
                </div>
                </React.Fragment>
            )
        }
        return (
            <div className='body'>
                {this.state.videoCalling && 
                <VideCallArea 
                    userVideo = {this.userVideo}
                    recipVideo = {this.recipVideo}
                />
                }
                {incomingCall}
                <Leftbar
                    rooms = {this.state.rooms}
                    roomId = {this.state.roomId}
                    name = {this.state.name}
                />
                <div className="chat">
                    <ChatHeader 
                        socket = {socket}
                        show_link = {this.state.show_link}
                        roomId = {this.state.roomId}
                        show_users_list = {this.state.show_users_list}
                        users = {this.state.users}
                        blueButtonClick={ (e) => this.setState({ show_link: !this.state.show_link }) }
                        showListToggle ={ () => this.setState({ show_users_list: !this.state.show_users_list }) }
                        videoCallClick ={ this.videoCall }
                    />
                    <MessagesSection 
                        messages = {this.state.messages}
                        socket = {socket}
                    />
                    <MessageInput
                        value={this.state.message}
                        onChange={({ target: { value } }) => this.setState({ message: value })}
                        onKeyPress={e => e.key === 'Enter' ? this.sendMessage(e) : null}
                        onClick={e => this.sendMessage(e)}    
                    />
                </div>
            </div>
        )
    }
}

export default Chat;