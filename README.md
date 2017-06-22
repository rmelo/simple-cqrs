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

app.useCommandHandler('showMessageCommand', (command) => {
	app.publish({ type: 'messageDisplayedEvent', message: command.message })
})

app.useEventHandler((event) => {
	console.log(`Message ${event.message} displayed.`)
}, 'messageDisplayedEvent')


app.send({ type: 'showMessageCommand', message: 'Hello World!' })
```

Download the example at [examples/simple-app](examples/simple-app)

## Introduction

There are two ways to use Simple-CQRS library. The easier, showed in [Quick Start section](#quickstart) above and the flexible that will be show in the [Docs](#docs) section. Both use a set of classes included in core module, but the easier uses a mediator `cqrs.createApp()` to coordinate the access of those core classes.

## Contents

* [Commands](#commands)
* [CommandDispatcher](#commandbus) (Command Bus)
* [Events](#events)
* [EventBus](#eventbus) (Event Bus)
* [Tests & Coverage](#tests)
* [Contributing](#contributing)
* [License](#license)

## <a name="docs"></a>Docs
### <a name="commands"></a>Commands

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

### <a name="commandbus"></a>CommandDispatcher as a default CommandBus

A command bus is responsible for routing the command to the handler that will execute it.
The CommandBus class is just an abstraction of a command bus and mustn't be instantiated.

You can implement a command bus by extending it. e.g: You can send a command through an Azure Service Bus Queue following this documentation: [How to use Service Bus queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues)

If you just want to handle/execute a command in the same proccess, you can use the CommandDispatcher class included in the core:

```js
const { CommandDispatcher } = require('simple-cqrs')
const dispatcher = new CommandDispatcher();
```  

The first thing you must do is register a handler for a command. 
You can register a function to handle the command, or a command handler type-based:

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

### <a name="events"></a>Events

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

### <a name="eventbus"></a>EventDispatcher as a default EventBus

Event bus is responsible to distribute the events to their handlers/listeners. It's a publish/subscribe communication pattern. 
The EventBus class is just an abstraction of an event bus and mustn't be instantiated.

You can implement your own event bus by extending the EventBus class. Just like CommanbBus, you can listen an infrastructure messaging component as an Azure Service Bus or RabbitMQ.

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


## <a name="tests"></a>Tests & Coverage

To run the test suite against simple-cqrs or check coverage, first install the dependencies, then run npm test:

```
$ npm install
$ npm test
$ npm run cover
```

We're using [mocha](https://mochajs.org/), [chai](http://chaijs.com/) and [sinon](http://sinonjs.org/) for testing and [istanbul](https://mochajs.org/) for coverage

## <a name="contributing"></a>Contributing

Feel free to make changes!

## <a name="license"></a>License

MIT License

Copyright (c) 2017 rmelo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[travis-image]: https://travis-ci.org/rmelo/simple-cqrs.svg?branch=master
[travis-url]: https://travis-ci.org/rmelo/simple-cqrs
[coveralls-image]: https://coveralls.io/repos/github/rmelo/simple-cqrs/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/rmelo/simple-cqrs?branch=master


[npm-url]: https://npmjs.org/package/simple-cqrs
[downloads-image]: http://img.shields.io/npm/dm/simple-cqrs.svg
[npm-image]: http://img.shields.io/npm/v/simple-cqrs.svg

[snyk-image]: https://snyk.io/test/github/rmelo/simple-cqrs/badge.svg
[snyk-url]: https://snyk.io/test/github/rmelo/simple-cqrs
