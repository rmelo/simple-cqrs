<img src="https://raw.githubusercontent.com/rmelo/simple-cqrs/master/assets/logo-md.png" width="280" >

Simple, small and flexible CQRS for [node](http://nodejs.org).



[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

## Installation

```bash
$ npm install simple-cqrs
```

## <a name="quickstart"></a>Quick Start 

```js
const cqrs = require('simple-cqrs')

const app = cqrs.createApp()

//Uses a function as a command handler. There's others way to do that using functions or objects.
app.useCommandHandler('showMessageCommand', (command) => {
	console.log(`Command ${command.type} handled`)
	app.publish({ type: 'messageDisplayedEvent', message: command.message })
})

//Uses a function as a event handler. There's others way to do that using functions or objects.
app.useEventHandler((event) => {
	console.log(`Message ${event.message} displayed.`)
}, 'messageDisplayedEvent')

//Sends a command
app.send({ type: 'showMessageCommand', message: 'Hello World!' })

/* The code above, prints:
* 1. Command showMessageCommand handled
* 2. Message Hello World! displayed.
*/
```

Download the example at [examples/simple-app](examples/simple-app)

## Introduction

There's two ways to use Simple-CQRS library. The easier, showed in [Quick Start section](#quickstart) above and the flexible that will be show in the [Docs](#docs) section. both use a set of classes included in core module, but the easier uses a mediator `cqrs.createApp()` to coordinate the access of those core classes.


## <a name="docs"></a>Docs
### Commands

You can use a json-based style command or a type-based command, the only requirement is to set the type of command:

```js
//json-based
const command = {type:'showMessageCommand', message:'Hello World!'};
```

When you use type-based command, you don't have to set the type manually. It's automatically set by Command class. The type will be the name of the subclass.
```js
//type-based using Ecma6
const { Command } = require('simple-cqrs')

class ShowMessageCommand extends Command{
  get message(){return this._message;}
  set message(value){this._message=value;}
}

//the type of above class is "ShowMessageCommand"
```

### CommandDispatcher as a default CommandBus

A command bus is responsible to routing the command to it's handler which will execute it.
The CommandBus class is just an abstraction of an command bus and musn't be instantiated.

You can implement a command bus by extending it. e.g: You can send a command through an Azure Service Bus Queue following this documentation: [How to use Service Bus queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues)

If you just want to handle/execute a command in the same proccess, you can use the CommandDispatcher class included in the core:

```js
const { CommandDispatcher } = require('simple-cqrs')
const dispatcher = new CommandDispatcher();
```  

The first thing you must do is register a handler for a command. 
You can register a function to handles the command, or a command handler type-based:

```js
//Registering a function as a handler of the ShowMessageCommand. 
dispatcher.register('ShowMessageCommand', (command)=>{
  console.log(command);
});

//Registering a command handler as a handler of the ShowMessageCommand. 
dispatcher.register('ShowMessageCommand', {factory:()=> {
  return new ShowMessageCommandHandler();
	}
});
```

You can't register a command twice. But you can register multiple commands for a handler:

```js
//Registering multiple commands for a function.
dispatcher.register(['ShowMessageCommand','ClearConsoleCommand'], (command)=>{
  switch(command.type){
    case 'ShowMessageCommand':
      console.log(command.message);
      break;
    case 'ClearConsoleCommand':
      console.clear();
      break;
    default:
      throw Error(`Command ${command.type} can\'t be handled.`)
  }
});
```

### Events

Just as commands, events also can use a json-based style or a type-based, the only requirement is to set the type of event:

```js
//json-based
const event = {type:'messageDisplayedEvent', message:'Hello World!'};
```

When you use type-based, you don't have to set the type manually. It's automatically set by Event class. The type will be the name of the subclass.
```js
//type-based using Ecma6
const { Event } = require('simple-cqrs')

class MessageDisplayedEvent extends Event {
  get message(){return this._message;}
  set message(value){this._message=value;}
}

//the type of above class is "MessageDisplayedEvent"
```

### EventDispatcher as a default EventBus

Event bus is responsible to distributes the events to their handlers/listeners. It's a publish/subscribe communication pattern. 
The EventBus class is just an abstraction of an event bus and musn't be instantiated.

You can implement your own event bus by extending the EventBus class. Just like CommanbBus, you can listen a infrastructure messaging component as a Azure Service Bus or RabbitMQ.

If you just want to handle/listen events in the same proccess, you can use the EventDispatcher class included in the core.

```js
const { EventDispatcher } = require('simple-cqrs')
const dispatcher = new EventDispatcher();
```  

The first thing you must do is register a handler for an event. 
You can register a function to handles the events, or a event handler type-based:

```js
//Registering a function as a handler of the MessageDisplayedEvent. 
dispatcher.register((event)=>{
  console.log(event);
}, 'MessageDisplayedEvent');

//Registering a event handler as a handler of the MessageDisplayedEvent. 
const MessageDisplayedEventHandler = class MessageDisplayedEventHandler extends EventHandler {
	constructor() {
		super()
		this.register('MessageDisplayedEvent', handler)
	}
	handle(event) {
		console.log(`Event ${event.type} handled`)
		}
}

const eventHandler = new MessageDisplayedEventHandler()

dispatcher.register(eventHandler, 'MessageDisplayedEvent');

```


## Tests

To run the test suite, first install the dependencies, then run npm test:

  `npm install`
  `npm test`

That's it for all.

[travis-image]: https://travis-ci.org/rmelo/simple-cqrs.svg?branch=master
[travis-url]: https://travis-ci.org/rmelo/simple-cqrs
[coveralls-image]: https://coveralls.io/repos/github/rmelo/simple-cqrs/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/rmelo/simple-cqrs?branch=master


[npm-url]: https://npmjs.org/package/simple-cqrs
[downloads-image]: http://img.shields.io/npm/dm/simple-cqrs.svg
[npm-image]: http://img.shields.io/npm/v/simple-cqrs.svg

[snyk-image]: https://snyk.io/test/github/rmelo/simple-cqrs/badge.svg
[snyk-url]: https://snyk.io/test/github/rmelo/simple-cqrs