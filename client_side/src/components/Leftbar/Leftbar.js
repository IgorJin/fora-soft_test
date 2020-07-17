import React from "react";
import './Leftbar.css'

class Leftbar extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className="leftbar">
                <div className="search">
                    <input type="text" name="search" placeholder="Поиск" />
                    <span className="search__icon"></span>
                </div>
                <div className="rooms_list">
                    {this.props.rooms.map((room, idx) =>
                        <div key={idx} className={`room_card ${room.id === this.props.roomId ? 'active' : ''}`}>
                            <a href={`/?name=${this.props.name}&roomId=${room.id}`}>
                                <div className="user__icon "><span className={room.ava}></span></div>
                                <div className="room_card__name">{room.roomName}</div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Leftbar;
