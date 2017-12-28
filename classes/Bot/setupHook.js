function setupHook(httpServer, verifyToken){
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
    if (data.object !== 'page')
      return

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(entry => {
      const pageID = entry.id
      const timeOfEvent = entry.time

      // Iterate over each messaging event
      entry.messaging.forEach(event => {

        let contact = this.contactRepository.getIs(event.sender)
        if (!contact){
          this.send(event.sender, 'Salut petit nouveau, n\'oublie pas de t\'inscrire aux SOS !')
          contact = this.contactRepository.insert(event.sender)
        }

        if (event.message) {
          this.handleMessage(contact, event)
        } else if (event.postback){
          this.handlePostback(contact, event)
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
  })
}

module.exports = setupHook
