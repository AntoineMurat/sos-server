const axios = require('axios')
const eleves = require('./eleves')
const TypesSos = require('./TypesSos')
const currentEvent = require('./events').sosAvailable()

// POST SOS
module.exports = function(req, res){

  form = req.body

  checkRecaptcha(req, form.recaptcha)
  .then(_ => checkDispo(form))
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

const checkDispo = form => new Promise((resolve, reject) => {
  // if (!sosAvailable())
  //   reject('Les SOS ne sont pas dispo')

  resolve()
})

const checkSosType = form => new Promise((resolve, reject) => {
  if (!TypesSos.some(type => type.type === form.type))
    reject('Type de SOS inconnu !')

  resolve()
})

const checkSosOptions = form => new Promise((resolve, reject) => {
  if (typeof form.options !== 'object')
    return reject('options devrait être un objet.')

  const typeSos = TypesSos.find(typeSos => typeSos.type === form.type)

  // Check required
  for (let parameter of typeSos.parameters){
    if (parameter.required && typeof form.options[parameter.code] === 'undefined')
      return reject(`option ${parameter.code} non remplie`)
  }

  // Not unwanted option
  for (let option in form.options){
    if (!typeSos.parameters.some(parameter => parameter.code === option))
      return reject(`option ${option} inconnue`)
  }

  // All options have correct values.
  for (let option in form.options){
    const parameter = typeSos.parameters.find(parameter => parameter.code === option)
    if (parameter.multi){
      if (!option instanceof Array)
        return reject(`l'option ${option} n'est pas de type valide`)
      if (!form.options[option].every(value => parameter.values.some(value2 => value2.code === value)))
        return reject(`l'option ${option} prend une valeur incorrecte`)
    } else {
      if (!parameter.values.some(value => value.code === form.options[option]))
        return reject(`la valeur ${form.options[option]} n'est pas valide pour le paramètre ${parameter.code}`)
    }
  }

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
  if (eleves.includes(form.coordonnees.firstname.toLowerCase() + ' ' + form.coordonnees.lastname.toLowerCase()))
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
