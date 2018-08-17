'use strict';

const Telegram = require('telegram-node-bot');

class TodoController extends Telegram.TelegramBaseController{
  addHandler($){
    let todo = $.message.text.split(' ').slice(1).join(' ');

    if(!todo) return $.sendMessage("Sorry, But please add a todo");

    $.getUserSession('todos')
    .then(todos=>{
      if(!Array.isArray(todos))$.setUserSession('todos', [todo]);
      else $.setUserSession('todos', todos.concat([todo]));
      console.log(todo);
      $.sendMessage('Added New Todo!');
    })
  }

  // startHandler($){
  //   $.sendMessage("*" + 1 + "*" + " //add then write anything you want to enter in todoList\n*2.* //get to get the list\n*3.* //check enter the index number you want to remove from list");
  // }

  getHandler($){
    $.getUserSession('todos').then(todos=>{
      $.sendMessage(this._serializeList(todos), {parse_mode : 'Markdown'});
    });
  }

  checkHandler($){
    let index =  parseInt($.message.text.split(' ').slice(1)[0]);
    if(isNaN(index)) return $.sendMessage("Sorry, But Please Enter a valid index.");

    $.getUserSession('todos')
    .then(todos=>{
      if(index >= todos.length) return $.sendMessage("Sorry, but this is not in Range")
      todos.splice(index-1, 1);
      $.setUserSession('todos', todos);
      $.sendMessage("Checked Todos!!!");
    })
  }

  _serializeList(todoList){
    let serialized = '*Your Todos :*\n\n';
    todoList.forEach((t, i)=>{
      serialized += "*" + ++i + "*" + ' = '+ t + '\n';
    });
    return serialized;
  }

  get routes(){
    return{
      'addCommand' : "addHandler",
      'getCommand' : "getHandler",
      'checkCommand' : "checkHandler",
      // 'startCommand' : "startHandler"
    };
  }
}

module.exports = TodoController;
