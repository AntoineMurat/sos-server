const express = require('express')

class HTTPServer{

	constructor(port = 80, staticDirectory = './../static/'){

		this.app = express()
		this.app.use(express.static(staticDirectory))

		


		this.app.listen(port, _ => console.log(`Serveur web en écoute sur le port ${port}.`))

	}

}

module.exports = HTTPServer