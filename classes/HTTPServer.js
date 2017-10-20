const fs = require('fs')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const debug = process.argv.includes('--debug') || process.argv.includes('-debug')

let options = {}

if (!debug){
	options = {
		cert: fs.readFileSync('./sslcert/fullchain.pem'),
		key: fs.readFileSync('./sslcert/privkey.pem')
	}
}

class HTTPServer{

	constructor(port = 80, httpsPort = 443, staticDirectory = './../static/'){

		this.app = express()
		// parse application/x-www-form-urlencoded
		this.app.use(bodyParser.urlencoded({ extended: false }))
		// parse application/json
		this.app.use(bodyParser.json())
		this.app.use(express.static(staticDirectory))

		this.app.listen(port, _ => console.log(`Serveur web en écoute sur le port ${port}.`))

		if (!debug)
			https.createServer(options, this.app).listen(httpsPort, _ => console.log(`Serveur web sécurisé en écoute sur le port ${httpsPort}.`))
	}

}

module.exports = HTTPServer