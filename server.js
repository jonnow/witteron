require('dotenv').config()
const fastify = require('fastify')({logger: true})
const path = require('path')
const fs = require('fs').promises
let params = {}

fastify.register(require('fastify-socket.io'))

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
})

fastify.register(require('point-of-view'), {
    engine: {
        handlebars: require('handlebars'),
    },
    layout: './templates/layouts/index.hbs',
})

fastify.register(require('fastify-formbody'))

fastify.register(require('./app/routes/chatroom'), { prefix: 'chatroom'})

fastify.get('/', (req, reply) => {
    params = { bodyClass: 'home' }
    reply.view('./templates/home.hbs', params)
})

fastify.post('/passcode', (req, reply) => {
    let incomingPasscode = req.body.passcode
    let authorised = false
    
    if(incomingPasscode != '') {
        // Authenticate passcode
        const passcodeFile = './.data/passcodes.json'
        const allPasscodes = fs.readFile(passcodeFile, (err, data) => {
            console.log('in incoming if')
            console.log('hello')
            if(err) console.log('error!', err)
            // debugger
            // console.log('here 1')
            // let passcodeJson = JSON.parse(data)
            // authorised = passcodeJson.passcodes.includes(incomingPasscode)

            // console.log('Authorised: ', authorised)

            // if(authorised) {
            //     console.log('here')
            //     params = { 
            //         useSockets: true, 
            //         bodyClass: 'chatroom'
            //     }
                
            //     reply.view('./templates/chatroom.hbs', params)
            // }
            // else {
            //     params = {  
            //         bodyClass: 'home',
            //         unauthorised: true
            //     }
                
               // reply.view('./templates/home.hbs', params)
            //}
            return data
        })
        
        allPasscodes.then(data => {
            debugger
            let jsonData = JSON.parse(data)
            authorised = jsonData.passcodes.includes(incomingPasscode)
            if(authorised) {
                params = { 
                    useSockets: true, 
                    bodyClass: 'chatroom'
                }
                
                reply.view('./templates/chatroom.hbs', params)
            }
            else {
                params = {  
                    bodyClass: 'home',
                    unauthorised: true
                }
                
               reply.view('./templates/home.hbs', params)
            
            }
        })

    }
    else {
        params = {  
            bodyClass: 'home',
            unauthorised: true
        }
        
        reply.view('./templates/home.hbs', params)
    }

    
})

fastify.ready(err => {
    if (err) throw err

    fastify.io.on('connect', (socket) => {
        console.info('Socket connected!', socket.id)
    
        socket.on('chat message', (msg) => {
            console.info('new message: ', msg)
            fastify.io.emit('chat message', msg)
        })
    })
})

fastify.listen(process.env.PORT, (err, address) => {
    if(err) {
        fastify.log.error(err)
        process.exit(1)
    }
})