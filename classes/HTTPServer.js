const fs = require('fs')
const https = require('https')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const nohttps = process.argv.includes('--nohttps') || process.argv.includes('-nohttps')

let options = {}

if (!nohttps){
	options = {
		cert: fs.readFileSync('./sslcert/fullchain.pem'),
		key: fs.readFileSync('./sslcert/privkey.pem')
	}
}

class HTTPServer{

	constructor(db, port = 80, httpsPort = 443, staticDirectory = './../public/'){

		this.db = db
		this.staticDirectory = staticDirectory

		this.app = express()

		// On met les sessions
		const sess = {
		  secret: 'c\'est le cookie très secret de la lord de ma tante',
		  cookie: {}
		}
		if (this.app.get('env') === 'production') {
		  this.app.set('trust proxy', 1) // trust first proxy
		  sess.cookie.secure = true // serve secure cookies
		}
		this.app.use(session(sess))

		// On restricte les pages admin :
		// Si on essaye d'accéder à une page admin sans l'être
		this.app.use((req, res, next) => {
			if (req.url != '/webhook' && ![
				'::ffff:93.31.194.184',
				'::ffff:127.0.0.1',
				'::1',
				'localhost',
				'::ffff:90.112.31.72', // Dylan
				'::ffff:84.6.21.122', // Alexandre
				'::ffff:77.136.86.171', // Menut
				'::ffff:82.122.243.184', // Gautier
				'::ffff:195.25.220.5', // Gaétan
				'::ffff:46.193.64.96', // Mathieu
				'::ffff:46.193.0.139', // Baptiste
				'::ffff:37.18.161.87', // Théo
				'::ffff:37.173.9.29', // Gloria
				'::ffff:46.193.2.48', // Théodore
				'::ffff:46.193.64.98', // Julien
				'::ffff:82.67.64.109', // Adam
				'::ffff:80.12.63.85', // Romain
				'::ffff:79.95.3.84', // Rémi
				'::ffff:37.173.171.175', // Lucille
				'::ffff:66.249.93.202', // Cyprien
			].includes(req.connection.remoteAddress))
				return res.send('PRECAMPAGNE ' + req.connection.remoteAddress)
			if (req.url.startsWith('/admin/')){
				if (req.session.isAdmin)
					return next()
				return res.redirect('/#/notfound')
			}
			next()
		})

		// parse application/x-www-form-urlencoded
		this.app.use(bodyParser.urlencoded({ extended: false }))
		// parse application/json
		this.app.use(bodyParser.json())
		this.app.use(express.static(staticDirectory))

		this.app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next()
		})

		this.app.listen(port, _ => console.log(`Serveur web en écoute sur le port ${port}.`))

		if (!nohttps)
			https.createServer(options, this.app).listen(httpsPort, _ => console.log(`Serveur web sécurisé en écoute sur le port ${httpsPort}.`))
	}

}

module.exports = HTTPServer
