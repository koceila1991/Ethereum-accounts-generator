
// générateur des adresses et clés Priv Ethereum 
//@ Koceila 22/03/2018

var EthUtil = require("ethereumjs-util")
var fs= require("fs")
var csv = require("fast-csv")
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log ('31');
} else {
    // set the provider you want from Web3.providers
    console.log ('41');
    var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/eth'))

}



var N= 2000 //Nombre de compte à creer

var hexToBytes = function(hex) {
  for (var bytes = [], c = 0; c < hex.length; c+=2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

var privateKeyToAddress = function(privateKey) {
  return `0x${EthUtil.privateToAddress(hexToBytes(privateKey)).toString('hex')}`
}

var privateKeyToPublic = function(privateKey) {
return EthUtil.privateToPublic(hexToBytes(privateKey)).toString('hex');
}






function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < N; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
var Priv = new Array();
var Pub = new Array();
var Adres= new Array();

for (var i = 0; i < N; i++)
{
    Priv[i]=EthUtil.sha3(makeid()).toString('hex');
}

console.log(Priv);

for (var i = 0; i < N; i++)
{
    Pub[i]=privateKeyToPublic(Priv[i]);
}

console.log(Pub);


for (var i = 0; i < N; i++)
{
    Adres[i]=privateKeyToAddress(Priv[i]);
}

console.log(Adres);


for (var i = 0; i < N; i++)
{

var x= web3.fromWei(web3.eth.getBalance(`${Adres[i]}`));
console.log('balance = '+ x.toNumber());


}





var csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("EtherAccounts.csv");
 

 
csvStream.pipe(writableStream);

for (var i = 0; i < N; i++)
{
csvStream.write({Adres:Adres[i], Priv:Priv[i], Pub:Pub[i]});
}
csvStream.end();
 

 // check 
 console.log("cela prend du temps ...");
 var message= "koceila"
 var messagebyte=EthUtil.sha3(message);
 var check=0;
for (var i = 0; i < N; i++)
{
	var pKeyx = new Buffer(Priv[i], "hex")
//console.log(pKeyx);
 var sign=EthUtil.ecsign(messagebyte,pKeyx);
// console.log(sign);
var signedHash = EthUtil.toRpcSig(sign.v, sign.r, sign.s).toString("hex")
// Recover 
var sigDecoded = EthUtil.fromRpcSig(signedHash)
var recoveredPub = EthUtil.ecrecover(messagebyte, sigDecoded.v, sigDecoded.r, sigDecoded.s) //recover Pub key
//console.log(recoveredPub.toString('hex'));
var recoveredAddress = "0x"+EthUtil.pubToAddress(recoveredPub).toString("hex")// recover Adress
//console.log(recoveredAddress);
if (recoveredAddress != Adres[i])
check+=1;
}
if (check==0)
	console.log("Vérification terminée,,, keep it safe");
else
		console.log("Je pense que tu dois refaire une autre liste : " +check+"erreurs");







