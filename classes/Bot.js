const FBMessenger = require('fb-messenger')
const loki = require('lokijs')
const crypto = require("crypto")
const db = new loki('db.json', {autosave: true})

class Bot{
	constructor(httpServer, token, verifyToken){
		this.httpServer = httpServer

		// Chargement de la BDD.
		this.contacts = db.getCollection('contacts') || db.addCollection('contacts')
		this.sos = db.getCollection('sos') || db.addCollection('sos')

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
							this.handleMessage(this.getContact(event.sender), event)
						} else if (event.postback){
							this.handlePostback(this.getContact(event.sender), event)
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

	handleMessage(contact, event){

		if (event.message.text.toLowerCase().includes('salut')){
			this.send(contact, 'Salut ! Pas de temps à perdre, on SOS !')
		} else if (event.message.text.toLowerCase().includes('newsos')){
			this.send(contact, 'Je rajoute un sos...')
			this.addSos({type:'Kebab', nom:'Antoine Murat', numero:'0604165959', details:'Vite, j\'ai faim.'})
		} else {
			this.send(contact, 'Désolé, je ne comprends pas tout encore... mais mets-toi au travail !')
		}

		this.sendMainMenu(contact)
	}

	handlePostback(contact, event){
		console.log(event.postback)

		if (event.postback.payload.startsWith('INSCRIRE_SOS:')){
			const sos = this.getSosById(event.postback.payload.split(':')[1])
			if (sos.contact !== false){
				send(contact, 'Ah, quelqu\'un a déjà récupéré le SOS...')
			} else if (sos.fini === true) {
				send(contact, 'Ah, quelqu\'un a mis fin à ce SOS...')
			} else {
				sos.contactId = contact.id
				this.sendSos(contact, [sos])
			}
		} else if (event.postback.payload.startsWith('ABANDONNER_SOS:')){
			const sos = this.getSosById(event.postback.payload.split(':')[1])
			sos.contactId = false
			this.send(contact, 'C\'est noté ! Envoie-moi un message pour trouver du taf\' !')
		} else if (event.postback.payload.startsWith('TERMINER_SOS:')){
			const sos = this.getSosById(event.postback.payload.split(':')[1])
			sos.fini = true
			this.send(contact, 'Un de moins ! Envoie-moi un message pour trouver du taf\' !')
		}

		switch(event.postback.payload){
			case 'JE_SOS':
				contact.sos = true
				this.send(contact, 'Nickel ! Envoie-moi un message pour trouver du taf\' ! Tu seras notifié des nouveaux SOS !')
				setTimeout(_ => this.sendAllSos(contact), 5000)
				break
			case 'JE_NE_SOS_PLUS':
				contact.sos = false
				this.send(contact, 'Repose-toi bien khey !')
				break
			case 'LISTE_SOS':
				this.sendAllSos(contact)
				break
			case 'LISTE_MES_SOS':
				this.send(contact, 'Voyons voir si tu as du travail...')
				this.sendMySos(contact)
		}
	}

	send(contact, message){
		this.messenger.sendTextMessage(contact.id, message, (err, body) => {
			if(err) return console.error(err)
			console.log(body)
		})
	}

	sendAll(message){
		this.contacts.forEach(contact => {
			this.send(contact, message)
		})
	}

	sendMainMenu(contact){
		if (contact.sos){
			this.messenger.sendButtonsMessage(contact.id, "Tu appartiens à la team SOS.", [{
				type:"postback",
				title:"Je ne SOS plus...",
				payload:"JE_NE_SOS_PLUS"
			},{
				type:"postback",
				title:"Liste les SOS.",
				payload:"LISTE_SOS"
			},{
				type:"postback",
				title:"Liste mes SOS.",
				payload:"LISTE_MES_SOS"
			}])
		} else {
			this.messenger.sendButtonsMessage(contact.id, "Tu n'appartiens pas à la team SOS.", [{
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

	sendAllSos(contact){
		this.sendSos(contact, this.getFreeSos())
	}

	sendMySos(contact){
		this.sendSos(contact, this.getSosByContact(contact))
	}

	sendSos(contact, sos){
		this.messenger.sendMessage(
			contact.id, 
			'{attachment: {type: "template", payload: {template_type: "generic", elements: [' + sos.map(aSos => JSON.stringify(this.generateSosPayload(aSos, contact))).join(',') + ']}}}')
	}

	getContact(sender){
		const contacts = this.contacts.where(contact => contact.id === sender.id)
		if (contacts.length !== 0)
			return contacts[0]
		sender.sos = false
		this.send(sender, 'Salut petit nouveau, n\'oublie pas de t\'inscrire aux SOS !')
		return this.contacts.insert(sender)
	}

	addSos(sos){
		/*sos = {
			type:"",
			nom:"",
			numero:"",
			details:""
		}*/

		sos.contactId = false
		sos.fini = false
		sos.id = crypto.randomBytes(16).toString("hex")
		return this.sos.insert(sos)
	}

	getFreeSos(){
		return this.sos.where(sos => sos.contactId === false && sos.fini === false)
	}

	getSosByContact(contact){
		return this.sos.where(sos => sos.contactId === contact.id && sos.fini === false)
	}

	getSosById(id){
		return this.sos.by('id', id)[0]
	}

	generateSosPayload(sos, contact = {id:0}){

		const buttons =  [{
			type: "phone_number",
			title: "Appeler.",
			payload: "Payload for first bubble",
		}]

		if (sos.contactId === contact.id)
			buttons.push({
				type: "postback",
				title: "Abandonner",
				payload: "ABANDONNER_SOS:"+sos.id
			})
		else
			buttons.push({
				type: "postback",
				title: "Accepter",
				payload: "INSCRIRE_SOS:"+sos.id
			})

		buttons.push({
			type: "postback",
			title: "Supprimer",
			payload: "TERMINER_SOS:"+sos.id
		})

		return {
			title: sos.type,
			subtitle: sos.details,
			item_url: "https://www.oculus.com/en-us/rift/",               
			image_url: "http://messengerdemo.parseapp.com/img/rift.png",
			buttons: buttons
		}
	}
}

module.exports = Bot