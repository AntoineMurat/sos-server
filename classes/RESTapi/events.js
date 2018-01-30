const events = [{
  code: 'ARRIVEE_SOS',
  textBefore: 'Les SOS débarquent dans',
  date: new Date(2018, 1, 3, 23, 59, 0),
  inEvent: false
}, {
  code: 'DEBUT_PTIT_DEJ',
  textBefore: 'Le P\'tit Dej débarque dans',
  date: new Date(2018, 1, 5, 8, 0, 0),
  inEvent: false
}, {
  code: 'FIN_PTIT_DEJ',
  textBefore: 'Le P\'tit Dej prend fin dans',
  date: new Date(2018, 1, 5, 17, 0, 0),
  inEvent: true
}, {
  code: 'DEBUT_KFET',
  textBefore: 'La KFET ouvre ses portes dans',
  date: new Date(2018, 1, 7, 18, 30, 0),
  inEvent: false
}, {
  code: 'FIN_KFET',
  textBefore: 'La KFET ferme ses porte dans',
  date: new Date(2018, 1, 7, 23, 30, 0),
  inEvent: true
}, {
  code: 'DEBUT_SOIREE',
  textBefore: 'La soirée ouvre ses portes dans',
  date: new Date(2018, 1, 9, 20, 0, 0),
  inEvent: false
}, {
  code: 'FIN_SOIREE',
  textBefore: 'La soirée ferme ses portes dans',
  date: new Date(2018, 1, 10, 4, 30, 0),
  inEvent: true
}, {
  code: 'DEBUT_ACTIVITE',
  textBefore: 'L\'activité libre arrive dans',
  date: new Date(2018, 1, 11, 12, 0, 0),
  inEvent: false
}, {
  code: 'FIN_ACTIVITE',
  textBefore: 'Activité libre en cours pendant',
  date: new Date(2018, 1, 11, 18, 0, 0),
  inEvent: true
}, {
  code: 'ENTREE_MANDAT',
  textBefore: 'On entre en mandat dans',
  date: new Date(2018, 7, 0, 0, 0, 0),
  inEvent: false
}, {
  code: 'INFINI',
  textBefore: 'Euh... l\'appli existe toujours ?',
  date: new Date(9999, 11, 0, 0, 0, 0),
  inEvent: false
}]

module.exports.currentEvent = _ => {
  const now = new Date()
  // On récuère la date la plue proche.
  let i = 0
  for (; events[i].date < now; i++);
  return events[i]
}

const sosAvailabilities = [
  [new Date(2018, 1, 3, 23, 59, 0), new Date(2018, 1, 4, 23, 59, 0)],
  [new Date(2018, 1, 5, 23, 59, 0), new Date(2018, 1, 6, 23, 59, 0)],
  [new Date(2018, 1, 7, 23, 59, 0), new Date(2018, 1, 8, 23, 59, 0)],
  [new Date(2018, 1, 9, 23, 59, 0), new Date(2018, 1, 10, 23, 59, 0)]
]

module.exports.sosAvailable = _ => {
  const now = new Date()
  return sosAvailabilities.some(creneau => creneau[0] < now && now < creneau[1])
}
