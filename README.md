# FileTransfer-using-node

So here a file transfer js which uses socket.io and net to transfer a file from one machine to another

run this file in both the machine

use npm install

use node 10.0 and above

run node filetransfer.js (on both machines,with in same network)

use Postman to make a post request

http://<address_of_machine_that_is_recieving_file>:port_of_express_app(default to 2345)/sendFile

body:{
"host" : "addressOfTheMachineSendingTheFile",

"hostport": 2345,    //change it if you have changed the port of express app

"senderEndpoint" : "/recivefile",       //route in express app

"fileName" : "C:/Users/pravin.nayak/Downloads/test.csv", // file location of sender machine that reciever will download


"localpath":"./output"             // location on the reciever,where the file from sender is stored
}



