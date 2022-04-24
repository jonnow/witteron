require('dotenv').config()
const fastify = require('fastify')({logger: true})
const socketIo = require('socket.io')
const path = require('path')

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
})

fastify.register(require('point-of-view'), {
    engine: {
        handlebars: require('handlebars'),
    },
})

fastify.register(require('./app/routes/chat'), { prefix: 'chats'})

fastify.get('/', (req, reply) => {
    let params = { bodyClass: 'home' }
    reply.view('./templates/index.hbs', params)
})

fastify.post('/passcode', (req, reply) => {
    debugger;
})

fastify.listen(process.env.PORT, (err, address) => {
    if(err) {
        fastify.log.error(err)
        process.exit(1)
    }
})