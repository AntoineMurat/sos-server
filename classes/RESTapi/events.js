const events = [{
  code: 'ARRIVEE_SOS',
  textBefore: 'Les SOS débarquent dans',
  date: new Date(2018, 1, 3, 23, 59, 0),
  inEvent: false
}, {
  code: 'DEBUT_PTIT_DEJ',
  textBefore: 'Le P\'tit Dej débarque dans',
  date: new Date(2018, 1, 5, 7, 0, 0),
  inEvent: false
}, {
  code: 'FIN_PTIT_DEJ',
  textBefore: 'Le P\'tit Dej prend fin dans',
  date: new Date(2018, 1, 5, 17, 0, 0),
  inEvent: true
}, {
  code: 'DEBUT_KFET',
  textBefore: 'La Kfet ouvre ses portes dans',
  date: new Date(2018, 1, 7, 18, 30, 0),
  inEvent: false
}, {
  code: 'FIN_KFET',
  textBefore: 'La Kfet ferme ses porte dans',
  date: new Date(2018, 1, 7, 23, 30, 0),
  inEvent: true
}, {
  code: 'DEBUT_SOIREE',
  textBefore: 'La soirée ouvre ses portes dans',
  date: new Date(2018, 1, 9, 23, 0, 0),
  inEvent: false
}, {
  code: 'FIN_SOIREE',
  textBefore: 'La soirée prend fin dans',
  date: new Date(2018, 1, 10, 4, 30, 0),
  inEvent: true
}, {
  code: 'DEBUT_ACTIVITE',
  textBefore: 'L\'activité libre arrive dans',
  date: new Date(2018, 1, 11, 14, 30, 0),
  inEvent: false
}, {
  code: 'FIN_ACTIVITE',
  textBefore: 'Activité libre en cours pendant',
  date: new Date(2018, 1, 11, 18, 30, 0),
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
  [new Date(2018, 1, 3, 23, 59, 0), new Date(2018, 1, 4, 14, 0, 0)],
  [new Date(2018, 1, 4, 20, 0, 0), new Date(2018, 1, 5, 7, 0, 0)],
  [new Date(2018, 1, 6, 0, 1, 0), new Date(2018, 1, 6, 19, 0, 0)],
  [new Date(2018, 1, 7, 1, 0, 0), new Date(2018, 1, 7, 8, 0, 0)],
  [new Date(2018, 1, 7, 16, 0, 0), new Date(2018, 1, 7, 18, 30, 0)],
  [new Date(2018, 1, 8, 0, 1, 0), new Date(2018, 1, 8, 19, 0, 0)],
  [new Date(2018, 1, 9, 0, 1, 0), new Date(2018, 1, 9, 18, 0, 0)],
  [new Date(2018, 1, 10, 6, 0, 0), new Date(2018, 1, 10, 13, 0, 0)],
  [new Date(2018, 1, 10, 18, 0, 0), new Date(2018, 1, 10, 22, 0, 0)],
  [new Date(2018, 1, 11, 18, 0, 0), new Date(2018, 1, 11, 23, 59, 0)]
]

module.exports.sosAvailable = _ => {
  const now = new Date()
  return sosAvailabilities.some(creneau => creneau[0] < now && now < creneau[1])
}
