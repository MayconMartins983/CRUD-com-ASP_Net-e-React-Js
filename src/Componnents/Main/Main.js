import React, { useEffect, useState } from 'react';
import './Main.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

const Main = () => {

//Obtendo onchange do formulario

    const [selectClientes, setSelectCLientes] = useState({
        name: '',
        email:'',
        tel:'',
        city:''
    })
    
    const handleChange = (event)=>{
        const {name,value} = event.target
        setSelectCLientes({
            ...selectClientes,[name]:value
        })
        
    } 

    const selectType = (cliente, opcao) =>{
        setSelectCLientes(cliente);
        (opcao == "Editar") ? openOrCloseModalEdit() : openOrCloseModalExcluir()
    }     

//Request Axios

    const [data, setData] = useState([])
    const apiUrl = "https://localhost:44332/api/clientes"
    const [updateData, setUpdateData] = useState(true)

    const getClientes = async () => {
        await axios.get(apiUrl)
            .then((response)=> {
                setData(response.data);
            })
            .catch((error)=> {
            console.log("Erro ao consumir a api"); 
            })
    }

    const createClientes = async () => {
        delete selectClientes.id;
        selectClientes.tel= parseInt(selectClientes.tel)
        await axios.post(apiUrl, selectClientes)
        .then((response)=> {
            setData(data.concat(response.data))
            setUpdateData(true) 
            openOrCloseModal()
        }).catch((error) => {
            console.log(error)
        })
    }
    
    const updateClientes = async() => {
        selectClientes.tel= parseInt(selectClientes.tel)
        await axios.put(apiUrl + "/" + selectClientes.id, selectClientes)
        .then ((response)=> {
            const resposta = response.data
            const dataAuxiliar = data
            dataAuxiliar.map((item)=> {
                if(item.id===selectClientes.id){
                    item.name = resposta.name
                    item.email = resposta.email
                    item.tel = resposta.tel
                }
                
            })
            setUpdateData(true) 
            openOrCloseModalEdit()
        }).catch((error)=>{
            console.log(error)
        })
    }

    const DeleteClientes = async() => {
        await axios.delete(apiUrl + '/' + selectClientes.id)
        .then(response => {
            setData(data.filter(item => item.id !== response.data))
            setUpdateData(true) 
            openOrCloseModalExcluir()
        })
        .catch((error)=> console.log(error))
    }

    useEffect(async ()=> {
        if(updateData){
            getClientes()
            setUpdateData(false)    
        }
    },[updateData])



//Abrir ou fechar modal

     const [modalOpen, setModalOpen] = useState(false)
     const [modalEditar, setModalEditar] = useState(false)
     const [modalExcluir, setModalExcluir] = useState(false)

     const openOrCloseModal = () => {
         setModalOpen(!modalOpen)
     }

     const openOrCloseModalEdit = () => {
        setModalEditar(!modalEditar)
    }

    const openOrCloseModalExcluir = () => {
        setModalExcluir(!modalExcluir)
    }


  return (
    <div className='main'>

        <button className='firstButton' onClick={openOrCloseModal}>Cadastrar Cliente</button>

        <table className="records" id="tableClient">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Celular</th>                    
                    <th>Ação</th>   
                </tr>

            </thead>

            <tbody>
              {data.map((cliente)=>(
                <tr key={cliente.id} className="teste">
                    <td>{cliente.name}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.tel}</td>                  
                    <td>
                        <button className='buttonMain Edit' onClick={()=> selectType(cliente, "Editar")}>Editar</button>
                        <button className='buttonMain Delete'onClick={()=> selectType(cliente, "Excluir")}>Excluir</button>
                    </td>
                </tr>   
              ))}     
            </tbody>

        </table>

    
        <Modal isOpen={modalOpen}>
            {<span className='Xfechar' onClick={openOrCloseModal}>X</span>}
            <ModalHeader>Adicionar Clientes</ModalHeader>
            
            <ModalBody>
                <div className="form-group">
                    <label>Nome: </label>
                    <input type='text' name='name' onChange={handleChange} className='form-control'></input>
                    <br/>
                    <label>Email: </label>
                    <input type='email' name='email' onChange={handleChange} className='form-control'></input>
                    <br/>
                    <label>Celular: </label>
                    <input type='number' name='tel' onChange={handleChange} className='form-control'></input>
                    <br/>              
                </div>
            </ModalBody>

            <ModalFooter>
                <button className='buttonMain Edit' onClick={()=>createClientes()}>Cadastrar</button>
                <button className='buttonMain Delete'onClick={openOrCloseModal}>Fechar</button>
            </ModalFooter>
        </Modal>


        <Modal isOpen={modalEditar}>
            {<span className='Xfechar' onClick={openOrCloseModalEdit}>X</span>}
            <ModalHeader>Editar Clientes</ModalHeader>
            
            <ModalBody>
                <div className="form-group">                    
                    <input type="text" className='form-control' readOnly value={selectClientes && selectClientes.id} style={{display:'none'}}></input>
                    <br/>
                    <label>Nome: </label>
                    <input type='text' name='name' onChange={handleChange} className='form-control' value={selectClientes && selectClientes.name}/>
                    <br/>
                    <label>Email: </label>
                    <input type='email' name='email' onChange={handleChange} className='form-control' value={selectClientes && selectClientes.email}/>
                    <br/>
                    <label>Celular: </label>
                    <input type='number' name='tel' onChange={handleChange} className='form-control' value={selectClientes && selectClientes.tel}/>
                    <br/>              
                </div>
            </ModalBody>

            <ModalFooter>
                <button className='buttonMain Edit' onClick={()=>updateClientes()}>Editar</button>
                <button className='buttonMain Delete' onClick={()=>openOrCloseModalEdit()}>Fechar</button>
            </ModalFooter>
        </Modal>


        <Modal isOpen={modalExcluir}>
            <ModalBody >
                    <div className="form-group">                    
                    <p>Você deseja excluir este cliente?</p>             
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button className='buttonMain Edit' onClick={() => DeleteClientes()}>Sim</button>
                    <button className='buttonMain Delete' onClick={()=>openOrCloseModalExcluir()}>Não</button>
                </ModalFooter>
        </Modal>
        

    </div>
  )
}

export default Main


