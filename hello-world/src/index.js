import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Welcome from './Welcome'

function tick() {

  /*const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );//element*/

 ReactDOM.render(
  <Welcome name="zhangrui"/>,
  document.getElementById('root')
 );
}
setInterval(tick,1000);

