const FBMessenger = require('fb-messenger')
const SosRepository = require("./repositories/SosRepository")
const ContactRepository = require("./repositories/ContactRepository")

class Bot{
	constructor(db, httpServer, token, verifyToken){
		this.httpServer = httpServer

		this.sosRepository = new SosRepository(db)
		this.contactRepository = new ContactRepository(db)

		this.messenger = new FBMessenger(token)

		// Loading external methods.
		this.setupHook = require('./Bot/setupHook')
		this.setupHook(httpServer, verifyToken)

		// A intervalle régulier, on notifie des SOS non gérés.
		setInterval(_ => {
			const contactsSos = new Map()
			this.sosRepository.getFree().forEach(sos => {
				this.contactRepository.getBestMatchesFor(sos).forEach(contact => {
					if (!contactsSos.has(contact))
						contactsSos.set(contact, [])
					contactsSos.get(contact).push(sos)
				})
			})
			contactsSos.forEach((sos, contact) => {
				this.send(contact, 'Ces SOS sont encore à gérer :')
				this.sendSos(contact, sos)
			})
		}, 1000 * 60 * 5)
	}

	handleMessage(contact, event){
		// event.message.text.toLowerCase().includes('newsos')
		console.log(event.message)

		// Si gps, on setHome.
		if (event.message.attachments.length > 0
			&& event.message.attachments[0].payload
			&& event.message.attachments[0].payload.coordinates
			&& event.message.attachments[0].payload.coordinates.lat
		  && event.message.attachments[0].payload.coordinates.long){
				contact.home = {
					lat: event.message.attachments[0].payload.coordinates.lat,
					lng: event.message.attachments[0].payload.coordinates.long
				}
				this.send(contact, 'Position MAJ !')
		} else {
			// Sinon on envoie le menu
			this.sendMenu(contact)
		}
	}

	handlePostback(contact, event){
		// Si on veut accepter un SOS :
		if (event.postback.payload.startsWith('ACCEPTER_SOS:')){
			const sos = this.sosRepository.getById(event.postback.payload.split(':')[1])
			if (sos.contactId !== false){
				this.send(contact, 'Ah, quelqu\'un a déjà récupéré le SOS...')
			} else if (sos.fini === true) {
				this.send(contact, 'Ah, quelqu\'un a mis fin à ce SOS...')
			} else {
				sos.contactId = contact.id
				contact.free = false
				this.sendSos(contact, [sos])
			}
		// Si on veut abandonner un SOS :
		} else if (event.postback.payload.startsWith('ABANDONNER_SOS:')){
			const sos = this.sosRepository.getById(event.postback.payload.split(':')[1])
			const contactToFree = this.contactRepository.getById(sos.contactId)
			contactToFree.free = true
			sos.contactId = false

			this.send(contact, 'C\'est noté ! Envoie-moi un message pour trouver du taf\' !')
		// Si on veut mettre fin à un SOS :
		} else if (event.postback.payload.startsWith('TERMINER_SOS:')){
			const sos = this.sosRepository.getById(event.postback.payload.split(':')[1])
			sos.fini = true
			const contactToFree = this.contactRepository.getById(sos.contactId)
			if (contactToFree)
				contactToFree.free = true
			this.send(contact, 'Un de moins ! Envoie-moi un message pour trouver du taf\' !')
		}

		switch(event.postback.payload){
			// Si quelqu'un veut SOS :
			case 'JE_SOS':
				contact.sos = true
				this.send(contact, 'Nickel ! Tu seras notifié des nouveaux SOS !')
				setTimeout(_ => this.sendAllSos(contact), 1000)
				break
			// Si qqn ne veut plus SOS :
			case 'JE_NE_SOS_PLUS':
				contact.sos = false
				this.sos.where(aSos => aSos.fini === false && aSos.contactId === contact.id).forEach(aSos => aSos.contactId = false)
				this.send(contact, 'Repose-toi bien !')
				break
			// Si qqn veut voir les SOS :
			case 'LISTE_SOS':
				this.sendAllSos(contact)
				break
			// Si qqn veut voir son SOS :
			case 'LISTE_MON_SOS':
				this.sendMySos(contact)
		}
	}

	send(contact, message){
		this.messenger.sendTextMessage(contact.id, message, (err, body) => {
			if (err) return console.error(err)
			console.log(body)
		})
	}

	sendAll(message){
		this.contactRepository.forEach(contact => {
			this.send(contact, message)
		})
	}

	/*
	* Envoyer le menu.
	*/
	sendMenu(contact){
		// Si le contact n'est pas dans la team SOS :
		if (!contact.sos){
			this.messenger.sendButtonsMessage(
				contact.id,
				"Tu n'appartiens pas à la team SOS.",
				[{
					type:"postback",
					title:"Je SOS.",
					payload:"JE_SOS"
				},{
					type:"postback",
					title:"Liste les SOS.",
					payload:"LISTE_SOS"
				}]
			)
		}
		// Si le contact est dans la team SOS :
		else {
			const buttons = [{
				type:"postback",
				title:"Je ne SOS plus...",
				payload:"JE_NE_SOS_PLUS"
			},{
				type:"postback",
				title:"Liste les SOS.",
				payload:"LISTE_SOS"
			}]
			// Si le contact appartient à la team SOS et n'est pas occupé :
			if (contact.free){

			}
			// Si le contact appartient à la team SOS et est occupé :
			else {
				buttons.push({
					type:"postback",
					title:"Affiche mon SOS.",
					payload:"LISTE_MON_SOS"
				})
			}
			this.messenger.sendButtonsMessage(
				contact.id,
				"Tu appartiens à la team SOS.",
				buttons
			)
		}
	}

	sendAllSos(contact){
		this.sendSos(contact, this.sosRepository.getFree())
	}

	sendMySos(contact){
		this.sendSos(contact, this.sosRepository.getTodoByContact(contact))
	}

	sendSos(contact, sos){

		const elements = sos.map(aSos => this.generateSosPayload(aSos, contact))

		this.messenger.sendMessage(
			contact.id, {attachment: {type: 'template', payload: {template_type: 'generic', elements: elements}}})
	}

	addSos(sos){
		/*sos = {
			type: "",
			coordonnees: {},
			options: {}
		}*/

		const newSos = this.sosRepository.insert(sos)
		this.contactRepository.getBestMatchesFor(newSos)
		.forEach(contact => this.sendSos(contact, [newSos]))

		return newSos
	}

	generateSosPayload(sos, contact = {id:0}){

		const buttons =  [{
			type: "phone_number",
			title: "Appeler",
			payload: sos.numero,
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
				payload: "ACCEPTER_SOS:"+sos.id
			})

		buttons.push({
			type: "postback",
			title: "Supprimer",
			payload: "TERMINER_SOS:"+sos.id
		})

		return {
			title: sos.type,
			subtitle: sos.details,
			// item_url: "https://www.oculus.com/en-us/rift/",
			image_url: "http://cdn1.zfood.co.uk/352/images/kebab.png",
			buttons: buttons
		}
	}
}

module.exports = Bot
