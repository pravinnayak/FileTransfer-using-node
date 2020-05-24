const net = require("net"), fs = require("fs");
var express = require('express')
var app = express()
var bodyParser = require("body-parser");

app.use(bodyParser.json())


app.post("/recivefile", function (req, res) {
    res.send("started")
    // let file = "D:/Abhijit/random.txt"
    console.log(req.body.fileName)
    let file = req.body.fileName
    let bufferData = fs.readFileSync(file)
    let server, istream = fs.createReadStream(file)
    // let server, istream = bufferStream

    // console.log(istream)

    server = net.createServer(socket => {
        socket.pipe(process.stdout);

        istream.on("readable", function () {
            let data;
            while (data = this.read()) {
                socket.write(data);
            }
            // socket.write(bufferData)

        })

        istream.on("end", function () {
            setTimeout(() => {
                socket.end();
                server.close(() => { console.log("\nTransfer is done!") });
            }, 1000);

        })
        // socket.on("end", () => {

        // })
    })

    server.listen(8000, '0.0.0.0');
})


app.post("/sendFile", function (req, res) {
    var http = require('http');
    const net = require("net"), fs = require("fs");

    res.json({"message":"Process started"})


    // exports.reciever = (localpath, fileName, host, hostport, senderEnpoint) => {
        console.log(req.body)
        var remoteHost = req.body.host
        var hostport = req.body.hostport
        let senderEndpoint = req.body.senderEndpoint
        let fileName = req.body.fileName
        var localPath = req.body.localpath || "./receiver"
        var post_data = {
            fileName: fileName || "D:/Anaconda/notExistingfile.pdf"
        }
        var post_options = {
            host: remoteHost || 'localhost',
            port: hostport || '2345',
            path: senderEndpoint || '/recivefile',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
            }
        };

        var post_req = http.request(post_options, function (res) {
            res.setEncoding('utf8');
            // console.log(res.data)
            let remote_server = remoteHost;
            let socket;

            socket = remote_server ? net.connect(8000, remote_server) : net.connect(8000);
            let OriginaFileName = post_data.fileName.split("/").pop()
            let ostream = fs.createWriteStream(localPath + "/" + OriginaFileName);
            let date = new Date(), size = 0, elapsed;
            socket.on('data', chunk => {
                size += chunk.length;
                elapsed = new Date() - date;
                socket.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`)
                process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`);
                ostream.write(chunk);
                //https://medium.com/@i_ambenkay/how-to-create-your-very-own-file-transfer-program-in-node-js-f57edef302c2
            });
            socket.on("end", () => {
                console.log(`\nFinished getting file. speed was: ${((size / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
                // process.exit();
                ostream.close()

            });

        });
        post_req.write(JSON.stringify(post_data));
        post_req.end();


    // }
})

app.listen(2345)



