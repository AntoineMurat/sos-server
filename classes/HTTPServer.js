const https = require('https')
const express = require('express')

const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
}

class HTTPServer{

	constructor(port = 80, httpsPort = 443, staticDirectory = './../static/'){

		this.app = express()
		this.app.use(express.static(staticDirectory))

		this.app.listen(port, _ => console.log(`Serveur web en écoute sur le port ${port}.`))
		https.createServer(options, this.app).listen(httpsPort, , _ => console.log(`Serveur web sécurisé en écoute sur le port ${httpsPort}.`))
	}

}

module.exports = HTTPServer