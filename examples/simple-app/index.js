const cqrs = require('simple-cqrs')

const app = cqrs.createApp()

//Registering a function as a handler of command, there's others way to do that.
app.useCommandHandler('showMessageCommand', (command) => {
	app.publish({ type: 'messageDisplayedEvent', message: command.message })
})

app.useEventHandler((event) => {
}, 'messageDisplayedEvent')

//Sending a command
app.send({ type: 'showMessageCommand', message: 'Hello World!' })

/* The example above, prints:
* 1. Command showMessageCommand handled
* 2. Message Hello World! displayed.
*/
