import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { ElectrumClient } from "electrum-cash";

const electrum = new ElectrumClient(
"Rostrum 7.0",
"1.4.3",
"rostrum.nexa.ink",
20004,
"wss"
);

await electrum.connect();
console.log('ELectrum connected');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
    res.render('index', { tokenimage: null, tokendescription: null, content: null, error: null });
});

app.post('/', async function(req, res) {
    let tokenId = req.body.tokenid;
    if (tokenId = req.body.tokenid) {
        const genesisInfo = await electrum.request("token.genesis.info", tokenId);
        let url = genesisInfo.document_url;
        if (url = genesisInfo.document_url) {
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(obj) {
            res.render('index', { 
            tokenimage: obj[0]["icon"], 
            tokendescription: "Token info (metadata): " + "Ticker: " + obj[0]["ticker"] + ", " + "Name: " + obj[0]["name"] + ", " + "Summary: " + obj[0]["summary"] + ", " + "Description: " + obj[0]["description"], 
            content: "Token info (blockchain): " + "Ticker: " + genesisInfo.ticker + ", " + "Name: " + genesisInfo.name + ", " + "Document url: " + genesisInfo.document_url + ", " + "Group id: " + genesisInfo.group + ", " + "Token id hex: " + genesisInfo.token_id_hex + ", " + "Txid: " + genesisInfo.txid + ", " + "Tx idem: " + genesisInfo.txidem + ", " + "Document hash: " + genesisInfo.document_hash, error: null 
            });
        })
        } else if (url = !genesisInfo.document_url) {
            res.render('index', { tokenimage: null, tokendescription: null, content: null, error: "This token has no .json url or it is invalid" });  
        }
    } else if (tokenId = !req.body.tokenid) {
        res.render('index', { tokenimage: null, tokendescription: null, content: null, error: "You need to provide valid Group Id/token Id" });
    }
});

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
console.log('Server listening on port '+ process.env.PORT + '!');
});