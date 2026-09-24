// Need this middleware to catch some requests
// and return both conversations where userId is sender or recipient
module.exports = (req, res, next) => {
  if (/conversations/.test(req.url) && req.method === 'GET') {
    const userId = req.query?.senderId
    // Read json-server's live database: requiring db.json only gave a snapshot taken at startup,
    // so the conversations created afterwards never showed up
    const conversations = req.app.db.get('conversations').value()
    const result = conversations.filter((conv) => conv.senderId == userId || conv.recipientId == userId)

    res.status(200).json(result)
    return
  }

  next()
}
