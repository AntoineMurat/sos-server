const FBMessenger = require('fb-messenger')

class Bot{
	constructor(httpServer, token, verifyToken){
		this.httpServer = httpServer
		this.contacts = []
		this.messenger = new FBMessenger(token)

		this.setupHook(httpServer, verifyToken)
	}

	setupHook(httpServer, verifyToken){
		// WebHook
		httpServer.app.get('/webhook', (req, res) => {
			if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
				console.log("Validating webhook")
				res.status(200).send(req.query['hub.challenge'])
			} else {
				console.error("Failed validation. Make sure the validation tokens match.")
				res.sendStatus(403) 
			}
		})

		httpServer.app.post('/webhook', (req, res) => {
			var data = req.body

			// Make sure this is a page subscription
			if (data.object === 'page') {

				// Iterate over each entry - there may be multiple if batched
				data.entry.forEach(entry => {
					const pageID = entry.id
					const timeOfEvent = entry.time

					// Iterate over each messaging event
					entry.messaging.forEach(event => {
						if (event.message) {
							this.addContact(event.sender.id)
						} else {
							console.log("Webhook received unknown event: ", event)
						}
					})
				})

				// Assume all went well.
				//
				// You must send back a 200, within 20 seconds, to let us know
				// you've successfully received the callback. Otherwise, the request
				// will time out and we will keep trying to resend.
				res.sendStatus(200)
			}
		})
	}

	notifyAll(){
		this.contacts.forEach(contact => {

			this.messenger.sendTextMessage(contact, 'SOS-Bot à votre service !', (err, body) => {
				if(err) return console.error(err)
				console.log(body)
			})

		})
	}

	addContact(contact){
		this.contacts.push(contact)
	}
}

module.exports = Bot