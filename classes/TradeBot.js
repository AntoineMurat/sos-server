const SocketIO = require('socket.io');

class TradeBot {

	constructor (httpServer) {
    if (typeof httpServer.https === 'undefined')
      return

    this.io = new SocketIO(httpServer.https)
    this.orders = []
    this.trades = []
    this.io.origins('*:*')

    this.io.on('connection', socket => {

      socket.on('initValues', fn => {
        fn({
          orders: this.orders.slice(0, 20),
          trades: this.trades.slice(0, 10)
        })
      })

      socket.on('newOrder', order => {
        if (typeof order === 'undefined')
          return
        const newOrder = {}
        if (!['buy', 'sell'].includes(order.order))
          return
        newOrder.order = order.order
        if (typeof order.username !== 'string' || order.username.length > 15 || order.username === '')
          return
        newOrder.username = order.username
        if (isNaN(order.price) || parseFloat(order.price) < 0.01 || parseFloat(order.price) > 10000000)
          return
        newOrder.price = parseFloat(order.price)
        newOrder.time = new Date(Date.now()).toLocaleString()
        newOrder.id = Math.random()
        this.addOrder(newOrder)
      })
    })

    setInterval(_ => this.checkTrades(), 50)
  }

  addOrder (order) {
    this.orders.unshift(order)
    this.io.emit('newOrder', order)
  }

  checkTrades () {
    let buys = this.orders.filter(order => order.order === 'buy')
    if (! buys.length) return
    let sells = this.orders.filter(order => order.order === 'sell')
    if (! sells.length) return
    const lowestSell = sells.sort((a,b)=>a.price-b.price)[0]
    const highestBuy = buys.sort((a,b)=>b.price-a.price)[0]
    if (lowestSell.price <= highestBuy.price) this.commitTrade(lowestSell, highestBuy)
  }

  commitTrade(sell, buy) {
    const newTrade = {
      id: Math.random(),
      time: new Date(Date.now()).toLocaleString(),
      price: sell.price,
      from: sell.username,
      to: buy.username
    }

    this.trades.unshift(newTrade)
    this.trades = this.trades.slice(0, 1000)
    this.io.emit('newTrade', newTrade)
    this.removeOrder(buy)
    this.removeOrder(sell)
  }

  removeOrder (order) {
    this.orders = this.orders.filter(anOrder => anOrder.id !== order.id).slice(0, 2000)
    this.io.emit('removeOrder', order)
  }

}

module.exports = TradeBot
