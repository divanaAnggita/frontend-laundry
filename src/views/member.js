import React from "react";
// import Navbar from "../component/Navbar";
import MemberList from "../views/component/MemberList";
import { base_url } from "../config";
import axios from "axios";
import $ from "jquery";

export default class Member extends React.Component{
    constructor(){
        super()
        this.state = {
            member: [],
            token: "",
            action: "",
            nama_member: "",
            tlp: "",
            alamat: "",
            jenis_kelamin: "",
            id_member: "",

        }
        if(localStorage.getItem("token")){
            this.state.token = localStorage.getItem("token")
            this.state.role = JSON.parse(localStorage.getItem("user")).role
        } else {
            window.location = "/login"
        } this.headerConfig.bind(this)
    }
    headerConfig = () => {
        let header ={
            headers: { Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }
    getMember = () => {
        let url = base_url + "/member"
        axios.get(url, this.headerConfig())
        .then(response =>{
            this.setState({member: response.data})
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
        $("#modal_member").modal("show")
        this.setState({
            action: "insert",
            id_member: 0,
            nama_member: "",
            alamat: "",
            jenis_kelamin: "",
            tlp: ""
        })
    }
    Edit = selectedItem => {
        $("#modal_member").modal("show")
        this.setState({
            action: "update",
            id_member: selectedItem.id_member,
            nama_member: selectedItem.nama_member,
            alamat: selectedItem.alamat,
            jenis_kelamin: selectedItem.jenis_kelamin,
            tlp: selectedItem.tlp
        })
    }
    saveMember = event => {
        event.preventDefault()
        $("#modal_member").modal("hide")
        let form = {
            id_member: this.state.id_member,
            nama_member: this.state.nama_member,
            alamat: this.state.alamat,
            jenis_kelamin: this.state.jenis_kelamin,
            tlp: this.state.tlp
        }

        let url = base_url + "/member"
        if(this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getMember()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getMember()
            })
            .catch(error => console.log(error))
        }
    }
    dropMember = selectedItem => {
        if(window.confirm("Apakah anda yakin ingin menghapus?")){
            let url = base_url + "/member/" + selectedItem.id_member
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getMember()
            })
            .catch(error => console.log(error))
        }
    }
    componentDidMount(){
        this.getMember(); 
    }
    render(){
        return(
            <div className="content">
                {/* <Navbar role={this.state.role}/> */}
                <div className="container">
                    <h3 className="text-bold text-info mt-2">
                        Member List
                    </h3>
                    <div className="row">
                        { this.state.member.map(item => (
                            <MemberList
                                key = {item.id_member}
                                nama_member = {item.nama_member}
                                tlp = {item.tlp}
                                alamat = {item.alamat}
                                onEdit = {() => this.Edit(item)}
                                onDrop = {() => this.dropMember(item)}
                            />
                        )) }
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Member
                    </button>
                </div>

                {/* modal member */}
                <div className="modal fade" id="modal_member">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Form Member</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.saveMember(ev)}>
                                    Member Name
                                    <input type="text" className="form-control mb-1"
                                    value={this.state.nama_member}
                                    onChange={ev => this.setState({nama_member: ev.target.value})}
                                    required
                                    />

                                    Member Address
                                    <input type="text" className="form-control mb-1"
                                    value={this.state.alamat}
                                    onChange={ev => this.setState({alamat: ev.target.value})}
                                    required
                                    />

                                    Jenis Kelamin
                                    <div className="form-group">
                                        <select name="jenis_kelamin" id="jenis_kelamin" className="form-control"
                                        onChange={ev => this.setState({jenis_kelamin: ev.target.value})}
                                        value={this.state.jenis_kelamin}>
                                            <option>--- Pilih ---</option>     
                                            <option value="Laki-Laki">
                                                Laki-Laki
                                            </option>
                                            <option value="Perempuan">
                                                Perempuan
                                            </option>
                                        </select>
                                    </div>

                                    Member Phone
                                    <input type="text" className="form-control mb-1"
                                    value={this.state.tlp}
                                    onChange={ev => this.setState({tlp: ev.target.value})}
                                    required
                                    />

                                    <button type="submit" className="btn btn-block btn-success">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}