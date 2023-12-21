const { Client } = require('@elastic/elasticsearch');
const ES_HOST = 'https://localhost:9200'; 
const client = new Client({ node: ES_HOST , auth  :{ username: "elastic" , password: "=N-t7n6=YpeSPO4yYoTy"},tls:{ rejectUnauthorized:false} });

module.exports = client;