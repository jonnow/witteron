module.exports = function(fastify, opts, done) {
    let params = {}
    
    fastify.get('/', (req, res) => {
        params = {
            bodyClass: 'chatroom',
            useSockets: true
        }
        res.view('./templates/chatroom.hbs', params)
    })
    done()
}