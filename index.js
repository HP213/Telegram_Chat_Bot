'use strict';



const Telegram = require('telegram-node-bot'),
  PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
  storage = new PersistentMemoryStorage(
    `${__dirname}/data/userStorage.json`,
    `${__dirname}/data/chatStorage.json`
  ),
tg = new Telegram.Telegram('639248095:AAGDGjlLm0ljHsjL0ZvsPzZYLAOGvqxue5Y', {
    workers : 1,
    storage : storage
  });

const PingController = require('./controller/ping');
const OtherwiseController = require('./controller/otherwise');
const TodoController = require('./controller/todo');
const ToController = require('./controller/todo');

tg.router.when(new Telegram.TextCommand('/ping', 'pingCommand'), new PingController())
    .otherwise(new OtherwiseController());

tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), new TodoController())
    .when(new Telegram.TextCommand('/get', 'getCommand'), new ToController())
    // .when(new Telegram.TextCommand('/start', 'startCommand'), new ToController())
    .when(new Telegram.TextCommand('/check', 'checkCommand'), new ToController())
    .otherwise(new OtherwiseController());

function exitHandler(exitCode){
  storage.flush();
  process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncaughtException', exitHandler.bind(null, 1));
