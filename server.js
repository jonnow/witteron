require('dotenv').config()
const socketIo = require('socket.io')
const fastify = require('fastify')({
    logger: true
})

fastify.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs'),
    },
})

fastify.register(require('./app/routes/chat'), { prefix: 'chats'})

fastify.get('/', (req, reply) => {
    reply.view('./templates/index.ejs')
})

fastify.listen(process.env.PORT, (err, address) => {
    if(err) {
        fastify.log.error(err)
        process.exit(1)
    }
})