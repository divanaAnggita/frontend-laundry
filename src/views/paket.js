import React from "react";
import axios from "axios";
// import Navbar from "../component/Navbar";
import { base_url } from "../config";
import $ from "jquery"
import PaketList from "../views/component/PaketList";

export default class Paket extends React.Component{
    constructor(){
        super()
        this.state = {
            paket: [],
            token: "",
            action: "",
            jenis_paket: "",
            harga: 0,
            id_paket: ""
        }
        if(localStorage.getItem("token")){
            this.state.token = localStorage.getItem("token")
            this.state.role = JSON.parse(localStorage.getItem("user")).role
            // console.log(this.state.token)
        } else {
            window.location="/login"
        }
        this.headerConfig.bind(this)
    }
    headerConfig = () => {
        let header ={
            headers: {Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }
    getPaket = () => {
        let url = base_url + "/paket"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({paket: response.data})
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
        $("#modal_paket").modal("show")
        this.setState({
            action: "insert",
            id_paket: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    // function edit -> untuk memberikan inisialisasi data dan menampilkan modal untuk mengedit data
    Edit = selectedItem => {
        $("#modal_paket").modal("show")
        this.setState({
            action: "update",
            id_paket: selectedItem.id_paket,
            jenis_paket: selectedItem.jenis_paket,
            harga: selectedItem.harga            
        })
    }

    savePaket = event => {
        event.preventDefault()
        $("#modal_paket").modal("hide")
        let form = {
            id_paket: this.state.id_paket,
            jenis_paket: this.state.jenis_paket,
            harga: this.state.harga
        }
        let url = base_url + "/paket"
        if(this.state.action === "insert"){
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPaket()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPaket()
            })
            .catch(error => console.log(error))
        }
    }
        // dropPaket -> untuk menghapus data paket
    dropPaket = selectedItem => {
        if (window.confirm("Yakin mau dihapus ?")) {
            let url = base_url + "/paket/" + selectedItem.id_paket
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPaket()
            })
            .catch(error => console.log(error))
        }
    }
        
    componentDidMount() {
        this.getPaket()
    }
    render(){
        return(
            <div className="content">
                {/* <Navbar role={this.state.role}/> */}
                <div className="container">
                    <h3 className="text-bold text-info mt-2">
                        Paket List
                    </h3>
                    <div className="row">
                        { this.state.paket.map( item => (
                            <PaketList
                            key = {item.id_paket} 
                            jenis_paket = {item.jenis_paket}
                            harga = {item.harga}
                            onEdit = {() => this.Edit(item)}
                            onDrop = {() => this.dropPaket(item)}
                            />
                        )) }
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Paket
                    </button>
                </div>

                {/* modal paket */}
                <div className="modal fade" id="modal_paket">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Form Paket</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.savePaket(ev)}>
                                    Jenis Paket
                                    <input type="text" className="form-control mb-1"
                                     value={this.state.jenis_paket}
                                     onChange={ev => this.setState({jenis_paket: ev.target.value})}
                                     required
                                     />

                                    Harga
                                    <input type="number" className="form-control mb-1"
                                     value={this.state.harga}
                                     onChange={ev => this.setState({harga: ev.target.value})}
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