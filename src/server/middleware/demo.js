// Demo tools, called by the demo panel so the app can be tested online
const fs = require('fs')
const path = require('path')

// The data as it was when the server started, restored by /demo/reset
const initialData = fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8')
let outageEnd = 0

module.exports = (req, res, next) => {
  // Simulated outage: every request fails until the end of the countdown
  if (Date.now() < outageEnd) {
    res.status(503).json({ error: 'Simulated outage' })
    return
  }

  if (req.method === 'POST' && req.path === '/demo/outage') {
    const seconds = Math.min(Number(req.query.seconds) || 20, 60)
    outageEnd = Date.now() + seconds * 1000
    res.sendStatus(204)
    return
  }

  if (req.method === 'POST' && req.path === '/demo/reset') {
    req.app.db.setState(JSON.parse(initialData)).write()
    res.sendStatus(204)
    return
  }

  next()
}
