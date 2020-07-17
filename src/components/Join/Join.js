import React from "react";
import { Link } from "react-router-dom";
import './join.css'

let data
class Join extends React.Component {
    constructor(props){
        super(props)
        this.state = { userName: '' , room: this.props.match.params.roomId};
    }
    async componentDidMount() {
        data = await fetch(`http://localhost:3001/info/${this.state.room}`) 
        data = await data.json()
        console.log(data)
        this.setState({room: data.roomId })
    }
    render() {
        return (
            <div className="join">
                <div className="joinInnerContainer">
                    <h1 className="title">Регистрируйтесь и присоединяйтесь!</h1>
                    <div className="joinInnerBg">
                        <input 
                            placeholder="Введите имя" value={this.state.userName} className="joinInput" type="text" 
                            onChange={(e) => this.setState({userName : e.target.value})} 
                        />
                        <Link 
                        onClick={e => (!this.state.userName) ? e.preventDefault() : null} 
                        to={`/?name=${this.state.userName}&roomId=${this.state.room}`}
                    >
                        <button>Зарегестрироваться</button>
                    </Link>
                    </div>
                    
                </div>
            </div>
        )
    }
}

  export default Join;