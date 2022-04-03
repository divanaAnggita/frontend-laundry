import React from "react";
// import Navbar from "../component/Navbar";
import { base_url } from "../config";
import axios from "axios";
// import $
// { error, event } 
// from "jquery"
import { Modal } from "reactstrap";

export default class User extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            action: "",
            user: [],
            id_user: "",
            nama_user: "",
            username: "",
            password: "",
            role: "",
            fillPassword: true,
            modal: false
        }
        if (localStorage.getItem("token")){
            this.state.token = localStorage.getItem("token")
            // this.state.role = JSON.parse(localStorage.getItem("user")).role
            // console.log(this.state.token)
        } else {
            window.location = "/admin/login"
        }
        this.headerConfig.bind(this)
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }
    getUser = () => {
        let url = base_url + "/user"
        axios.get(url, this.headerConfig())
        .then(response =>{
            this.setState({user: response.data})
        })
        .catch(error => {
            if(error.response){
                if(error.response.status){
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            } else {
                console.log(error);
            }
        })
    }
    
    Add = () => {
        // $("#modal_user").modal("show")        
        this.setState({
            action: "insert",
            id_user: 0,
            nama_user: "",
            username: "",
            password: "",
            role: "",
            fillPassword: true,
            modal: true
        })
    }
    Edit = selectedItem => {
        // $("#modal_user").modal("show")
        this.setState({
            action: "update",
            id_user: selectedItem.id_user,
            nama_user: selectedItem.nama_user,
            username: selectedItem.username,
            password: selectedItem.password,
            role: selectedItem.role,
            modal: true
        })
    }
   
    saveUser = event => {
        event.preventDefault()
        // $("#modal_user").modal("hide")
        let form = {
            id_user: this.state.id_user,
            nama_user: this.state.nama_user,
            role: this.state.role,
            username: this.state.username
        }
        
        if (this.state.fillPassword) {
            form.password =  this.state.password
        }

        let url = base_url + "/user"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getUser()
                this.setState({modal:false})
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getUser()
                this.setState({modal:false})
            })
            .catch(error => console.log(error))
        }
    }
    dropUser = selectedItem => {
        if(window.confirm("Apakah anda yakin akan menghapus?")){
            let url = base_url + "/user/" + selectedItem.id_user
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getUser()
            })
            .catch(error => console.log(error))
        }
    }
    componentDidMount(){
        this.getUser();
    }
    render(){
        return(
            <div className="content">
                {/* <Navbar role={this.state.role}/> */}
                <div className="container">
                    <h3 className="text-bold text-info mt-2">
                        User List
                    </h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama User</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.user.map((item, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.nama_user}</td>
                                    <td>{item.username}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info m-1"
                                        onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-sm btn-info m-1"
                                        onClick={() => this.dropUser(item)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add User
                    </button>

                    {/* Modal User */}
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form User</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => this.saveUser(ev)}>
                                        Nama User
                                        <input type="text" className="form-control mb-1 bg-dark"
                                        value={this.state.nama_user}
                                        onChange={ev => this.setState({nama_user: ev.target.value})} 
                                        required
                                        />

                                        Role
                                        <div className="form-group">
                                            <select name="role" id_role="role" className="form-control bg-dark"
                                            onChange={ev => this.setState({role: ev.target.value})}
                                            id="exampleFormControlSelect1" value={this.state.role}>
                                                <option>--- Pilih ---</option>     
                                                <option value="admin">
                                                    Admin
                                                </option>
                                                <option value="kasir">
                                                    Kasir
                                                </option>
                                            </select>
                                        </div>

                                        Username
                                        <input type="text" className="form-control mb-1 bg-dark"
                                        value={this.state.username}
                                        onChange={ev => this.setState({username: ev.target.value})}
                                        required
                                        />

                                        { this.state.action === "update" && this.state.fillPassword === false ? (
                                            <button className="btn btn-sm btn-secondary mb-1 bg-dark"
                                            onClick={() => this.setState({fillPassword: true})}>
                                                Change Password
                                            </button>
                                        ) : (
                                            <div>
                                                Password
                                                <input type="password" className="form-control mb-1 bg-dark"
                                                value={this.state.password}
                                                onChange={ev => this.setState({password: ev.target.value})}
                                                required
                                                />
                                            </div>
                                        ) }

                                        <button type="submit" className="btn btn-block btn-success">
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                    </Modal>
                </div>
            </div>
        )

    }
}