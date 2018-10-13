import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import SelectCustomizado from './components/SelectCustomizado';

export class FormularioLivros extends Component {

    constructor() {
        super();
        this.state = {titulo:'', preco:'', autorId:''};
        this.enviaForm = this.enviaForm.bind(this);
    }

    salvaAlteracao(nomeInput,evento){
        this.setState({[nomeInput]:evento.target.value});
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/livros',
            contentType:'application/json',
            dataType:'json',
            type:'post',
            data:JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
            success:function(novaLista){
                PubSub.publish('atualiza-lista-livros',novaLista);
                this.setState({titulo:'',preco:'',autorId:''});
            }.bind(this),
            error:function(resposta){
                if(resposta.status === 400){
                    console.log(resposta);
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
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this,'titulo')} label="Título"/>
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.salvaAlteracao.bind(this,'preco')} label="Preço"/>
                    <SelectCustomizado lista={this.props.autores} onChange={this.salvaAlteracao.bind(this,'autorId')} label="Autor"/>
                    <BotaoSubmitCustomizado type="submit" label="Gravar"/>
                </form>             
            </div>  
        );
    }

}

export class TabelaLivros extends Component {

    render() {
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Preço</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.livros.map((livro)=>{
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.autor.nome}</td>
                                    <td>{livro.preco}</td>
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

export default class LivroBox extends Component {
    
    constructor() {
        super();
        this.state = {livros : [], autores: []};
    }

    componentWillMount() {
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/autores',
            dataType:'json',
            success:function(retorno){
            this.setState({autores:retorno});
          }.bind(this)
        });
    }

    componentDidMount() {
        $.ajax({
            url:'http://cdc-react.herokuapp.com/api/livros',
            dataType:'json',
            success:function(retorno){
            this.setState({livros:retorno});
          }.bind(this)
        });
        PubSub.subscribe('atualiza-lista-livros',function(topico,novaLista){
            this.setState({livros:novaLista})
        }.bind(this));
    }

    render() {
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivros autores={this.state.autores}/>
                    <TabelaLivros livros={this.state.livros}/> 
                </div>
            </div>
        )

    }

}