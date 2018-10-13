import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route,  } from 'react-router-dom';


ReactDOM.render(
    <BrowserRouter>
        <App>
            <Route exact path='/' component={Home}/>
            <Route path='/autor' component={AutorBox}/>
            <Route path='/livro' component={LivroBox}/>
        </App>
    </BrowserRouter>, 
    document.getElementById('root')
);
serviceWorker.unregister();
