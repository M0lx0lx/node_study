const http = require('http');
// const express = require('express');
// const app = express();

 http.get(`http://localhost:8081`, (res_i) => {
            console.log('headers:', res_i.headers);
            console.log('statusCode:', res_i.statusCode);
    
        }).on('error', (e) => {
            console.error(e);
        });