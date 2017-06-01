<img src="https://raw.githubusercontent.com/rmelo/simple-cqrs/master/assets/logo-md.png" width="280" >

Simple, small and flexible CQRS for [node](http://nodejs.org).



[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

## Status

Including events module... finish this week!

## Installation

```bash
$ npm install simple-cqrs
```

## Quick Start

```js
const {CommandDispatcher} = require('simple-cqrs');

const dispatcher = new CommandDispacther();

disptacher.register('showMessageCommand', (command)=>{
    console.log(command.message);
});

dispatcher.send({type:'showMessageCommand', message:'Hello World!'});
//Prints: Hello World!

```

## Docs
### Commands

You can use a json-based style command or a type-based command, the only requirement is to set the type of command:

```js
//json-based
const command = {type:'showMessageCommand', message:'Hello World!'};
```

When you use type-based command, you don't have to set the type manually. It's automatically set by Command class. The type will be the name of the subclass.
```js
//type-based using Ecma6
const Command = require('simple-cqrs').Command;

class ShowMessageCommand extends Command{
  get message(){return this._message;}
  set message(value){this._message=value;}
}

//the type of above class is "ShowMessageCommand"
```

### CommandFactory

You can convert a json-based command to a type-based command using the CommandFactory class. Sometimes it's needed when you receive a serialized command from a channel like a service bus.

```js
const CommandFactory = require('simple-cqrs').CommandFactory;

const factory = new CommandFactory();
bus.onReceiveMessage((message)=>{
  const command = factory.create(message);
});
``` 

The CommandFactory class loads the commands dynamically from the path specified in the constructor. The default path is "./commands". But you can change it.

### CommandBus and CommandDispatcher

A command bus is responsible to routing the command to it's handler which will execute it.
The CommandBus class is just an abstraction of an command bus and musn't be instantiated.

You can implement a command bus by extending it. e.g: You can send a command through an Azure Service Bus Queue following this documentation: [How to use Service Bus queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues)

If you just want to handle/execute a command in the same proccess, you can use the CommandDispatcher implementation:

```js
const CommandDispatcher = require('simple-cqrs').CommandDispatcher;
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
dispatcher.register('ShowMessageCommand', {factory:()=>{
  return new ShowMessageCommandHandler();
}});
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