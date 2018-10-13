import React, { Component } from 'react';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {nome:'', email:'', senha:''};
        this.enviaForm = this.enviaForm.bind(this);
    }

    salvaAlteracao(nomeInput,evento){
        this.setState({[nomeInput]:evento.target.value});
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/autores',
            contentType:'application/json',
            dataType:'json',
            type:'post',
            data:JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
            success:function(novaLista){
                PubSub.publish('atualiza-lista-autores',novaLista);
                this.setState({nome:'',email:'',senha:''});
            }.bind(this),
            error:function(resposta){
                if(resposta.status === 400){
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend:function(){
                PubSub.publish("limpa-erros",{});
            }
        });
    }
    
    render() {
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} label="Nome"/>
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} label="Email"/>
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} label="Senha"/>
                    <BotaoSubmitCustomizado type="submit" label="Gravar"/>
                </form>             
            </div>  
        );
    }

}

export class TabelaAutores extends Component {

    render() {
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map((autor)=>{
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table> 
            </div> 
        );
    }

}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista : []};
    }

    componentDidMount() {
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/autores',
            dataType:'json',
            success:function(retorno){
            this.setState({lista:retorno});
          }.bind(this)
        });
        PubSub.subscribe('atualiza-lista-autores',function(topico,novaLista){
            this.setState({lista:novaLista})
        }.bind(this));
    }

    render() {
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/> 
                </div>
            </div>
        )

    }
}