const axios = require('axios')
const eleves = require('./eleves')

// POST SOS
module.exports = function(req, res){

  form = req.body

  checkRecaptcha(req, form.recaptcha)
  .then(_ => checkSosType(form))
  .then(_ => checkSosOptions(form))
  .then(_ => checkCoordonnees(form))
  .then(_ => checkRadius(form))
  .then(_ => buildSos(form))
  .then(sos => addSos.bind(this)(sos))
  .then(_ => res.json({error: false}))
  .catch(error => {
    res.json({error: error})
    console.log(error)
  })
}

const checkRecaptcha = (req, response) => new Promise((resolve, reject) => {
  if (req.session.isAdmin)
    return resolve('est admin')
  const SECRET = '6LciiD0UAAAAAAN7KCAYbAvRsWm-pUFHmS3L6Pfv'
  axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${
    SECRET}&response=${response}`)
  .then(res => {
    if (res.data.success)
      return resolve('reCaptcha ok')
    reject('Invalid reCaptcha')
  })
  .catch(error => reject(error))
})

const checkSosType = form => new Promise((resolve, reject) => resolve())

const checkSosOptions = form => new Promise((resolve, reject) => {
  if (typeof form.options !== 'object')
    return reject('options devrait être un objet.')

  resolve()
})

const checkCoordonnees = form => new Promise((resolve, reject) => {
  if (typeof form.coordonnees !== 'object')
    return reject('coordonnees devrait être un objet.')
  const coordonnees = form.coordonnees
  if (![
    coordonnees.firstname,
    coordonnees.lastname,
    coordonnees.city,
    coordonnees.address,
    coordonnees.phone,
    coordonnees.comment
  ].every(arg => typeof arg === "string"))
    return reject('coordonnees invalides.')
  if (!['Grenoble', 'Meylan', 'St Martin d\'Hères'].includes(coordonnees.city))
    return reject('ville invalide')

  resolve()
})

const checkRadius = form => new Promise((resolve, reject) => {

  const distance = (dest, center) => {
    const degreesToRadians = degrees => degrees * Math.PI / 180
    const earthRadiusKm = 6371

    const dLat = degreesToRadians(center.lat-dest.lat)
    const dLon = degreesToRadians(center.lng-dest.lng)

    const lat1 = degreesToRadians(center.lat)
    const lat2 = degreesToRadians(dest.lat)

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = earthRadiusKm * c
    return distance
  }

  const dest = form.coordonnees.coordinates
  if (isNaN(dest.lat) || isNaN(dest.lng))
    return reject('coordinates inalides')
  if (distance(dest, {lat: 45.186593, lng: 5.742720}) > 3)
    return reject('trop loin')

  resolve()
})

const buildSos = form => new Promise((resolve, reject) => {
  if (eleves.inludes(form.coordonnees.firstname.toLowerCase() + ' ' + form.coordonnees.lastname.toLowerCase()))
    form.coordonnees.ensimag = true
  else
    form.coordonnees.ensimag = false
  const sos = {
    type: form.type,
    options: form.options,
    coordonnees: form.coordonnees
  }
  resolve(sos)
})

function addSos( sos ) {
  return new Promise((resolve, reject) => {
    this.bot.addSos(sos)
    resolve()
  })
}
