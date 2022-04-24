module.exports = function(fastify, opts, done) {
    fastify.get('/', (req, res) => {
        res.send({hello:'chat routes'})
    })
    done()
}