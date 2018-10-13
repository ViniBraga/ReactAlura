import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component {

    constructor() {
        super();
        this.state = {msgErro:''};
    }

    render() {
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <select name={this.props.id} onChange={this.props.onChange}>
                    <option value="">Selecione</option>
                    {
                        this.props.lista.map(function(n){
                            return <option key={n.id} value={n.id}>
                                {n.nome}
                            </option>;
    })
                        })
                    }
                </select>
                <span className="error">{this.state.msgErro}</span>
            </div>

        );
    }

    componentDidMount() {
        PubSub.subscribe('erro-validacao',function(topico,erro){
            if(erro.field === this.props.titulo){
                this.setState({msgErro:erro.defaultMessage})
            }
        }.bind(this));
        PubSub.subscribe('limpa-erros',function(topico){
            this.setState({msgErro:''})
        }.bind(this));
    }

}