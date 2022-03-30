import React from "react";
import axios from "axios"
import bg from "../../gambar/bg-3.png";

//import base_url dari file config.js
import { base_url } from "../../config";

export default class login extends React.Component{
    constructor(){
        super();
        //tambah state sesuai dengan kebutuhan anda
            this.state = {
                username: "",
                password: "",
                message: "",
                role: "",
                logged: true
            }
    }
    login = event => {
        event.preventDefault()
        let sendData = {
            username: this.state.username,
            password: this.state.password,
            role: this.state.role
        }
        let url = base_url + "/auth"

        // console.log(sendData)
        axios.post(url,sendData)
        .then(res => {
            this.setState({logged:res.data.logged})
            if(this.state.logged){
                let user = res.data.data
                let token = res.data.token
                localStorage.setItem("user",JSON.stringify(user))
                localStorage.setItem("token",token)
                this.props.history.push("/")
            } else {
                this.setState({message: res.data.message})
            }
        })
        .catch(error => console.log(error))
    }
    render(){
        return(
            <div style={{ 
                height: "100vh",backgroundImage:`url(${bg})`}}>
            <div className="d-flex h-100 justify-content-center align-items-center" >
                <div className="col-sm-6 card my-5" style={{borderRadius: "20px", maxWidth: 400}}>
                    <div className="card-body" >
                        <h5 className="card-title" style={{textAlign:'center'}}>LOGIN</h5>
                        { !this.state.logged ? 
                        (
                            <div className="alert alert-danger mt-1">
                                { this.state.message }
                            </div>
                        ) : null }
                        <form onSubmit={ev => this.login(ev)}>
                            {/* username */}
                            <label class="form-label" >Username : </label>
                            <input type="text" className="form-control mb-1" placeholder="Username " value={this.state.username}
                            onChange={ev => this.setState({username: ev.target.value})} style={{borderRadius: "12px"}}/>

                            {/* password */}
                            <label class="form-label">Password : </label>
                            <input type="password" className="form-control mb-1" placeholder="Password " value={this.state.password}
                            onChange={ev => this.setState({password: ev.target.value})}
                            autoComplete="false" style={{borderRadius: "12px"}}/>

                            {/* posisi */}
                            <label class="form-label" >Posisi : </label>
                            <select className="form-select form-select-sm" id="inlineFormCustomSelect" onChange={(ev) => this.setState({ role: ev.target.value })} value={this.state.role}
                            style={{borderRadius: "12px", textAlign:'center'}}>
                                    <option selected>Choose...</option>
                                    <option value="admin">Admin</option>
                                    <option value="kasir">Kasir</option>
                                </select> 
                            <center>
                            <button className="btn btn-success btn-sm" type="submit" style={{marginTop: 10}}>
                                Sign In
                            </button>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}