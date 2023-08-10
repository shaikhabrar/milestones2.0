import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import elasticapm from 'elastic-apm-node';


const root = ReactDOM.createRoot(document.getElementById('root'));

elasticapm.start({
  serviceName: 'my-service-name',
  secretToken: 'LzHPl3vqqZZoxHa6f9',
  serverUrl: 'https://9a3569eff2f342168bf5518c0ddcb75c.apm.us-central1.gcp.cloud.es.io:443',
  environment: 'my-environment'
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
