const FBMessenger = require('fb-messenger')
const loki = require('lokijs')
const db = new loki('db.json', {autosave: true})

class Bot{
	constructor(httpServer, token, verifyToken){
		this.httpServer = httpServer

		// Chargement de la BDD.
		this.contacts = db.getCollection('contacts') || db.addCollection('contacts')

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
			const data = req.body

			// Make sure this is a page subscription
			if (data.object === 'page') {

				// Iterate over each entry - there may be multiple if batched
				data.entry.forEach(entry => {
					const pageID = entry.id
					const timeOfEvent = entry.time

					// Iterate over each messaging event
					entry.messaging.forEach(event => {
						if (event.message) {
							this.handleMessage(event)
						} else if (event.postback){
							this.handlePostback(event)
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

	handleMessage(event){
		console.log('Message reçu.')

		switch(event.message.text){
			case 'Je sos':
			case 'je sos':
				this.addContact(event.sender)
				break

			case 'Je ne sos plus':
			case 'je ne sos plus':
				this.removeContact(event.sender)
				break
		}

		this.sendMainMenu(event.sender)
	}

	handlePostback(event){
		console.log(event.postback)
		switch(event.postback.payload){
			case 'JE_SOS':
				this.addContact(event.sender)
				break
			case 'JE_NE_SOS_PLUS':
				this.removeContact(event.sender)
				break
			case 'LISTE_SOS':
				this.send(event.sender, 'Non implémenté')
		}

		this.sendMainMenu(event.sender)
	}

	send(contact, message){
		this.messenger.sendTextMessage(contact.id, message, (err, body) => {
			if(err) return console.error(err)
			console.log(body)
		})
	}

	sendMainMenu(contact){
		if (this.getStatus(contact) === "Tu appartiens à la team SOS."){
			this.messenger.sendButtonsMessage(contact.id, this.getStatus(contact), [{
				type:"postback",
				title:"Je ne SOS plus...",
				payload:"JE_NE_SOS_PLUS"
			},{
				type:"postback",
				title:"Liste les SOS.",
				payload:"LISTE_SOS"
			}])
		} else {
			this.messenger.sendButtonsMessage(contact.id, this.getStatus(contact), [{
				type:"postback",
				title:"Je SOS.",
				payload:"JE_SOS"
			},{
				type:"postback",
				title:"Liste les SOS.",
				payload:"LISTE_SOS"
			}])
		}
	}

	getStatus(contact){
		if (this.contacts.where(contactToCheck => contact.id === contactToCheck.id).length !== 0)
			return "Tu appartiens à la team SOS."
		else
			return "Tu n'appartiens pas à la team SOS."
	}

	sendAll(message){
		this.contacts.forEach(contact => {
			this.send(contact, message)
		})
	}

	addContact(contact){
		this.contacts.insert(contact)
	}

	removeContact(contact){
		this.contacts.removeWhere(contactToCheck => contact.id === contactToCheck.id)
	}
}

module.exports = Bot