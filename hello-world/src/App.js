import React, { Component } from 'react';
import 'normalize.css'
import './reset.css'
import './index.css';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import * as localStore from './localStore'

class App extends Component {
  constructor(props){
    super(props)
//super关键字用于访问父对象上的函数
//调用super的原因：在ES6中，在子类的constructor中必须先调用super才能引用this
//super(props)的目的：在constructor中可以使用this.props
    this.state={  
      newTodo:'',
      todoList: localStore.load('todoList') || []
    }
  }//constructor

  render() {
      let todos=this.state.todoList.filter((item)=>!item.deleted).map((item,index)=>{
        return(
          <li key={index}>
            <TodoItem todo={item} onToggle={this.toggle.bind(this)} 
            onDelete={this.delete.bind(this)}/>
          </li>
        )//return
      })

      return (
      <div className="App">
        <h1 className="myTitle">我的记事本</h1>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
          onChange={this.changeTitle.bind(this)}
          onSubmit={this.addTodo.bind(this)}/>
        </div>
        <ol className="todoList">
          {todos}
        </ol>
      </div>
    )//return
  }//render

  componentDidUpdate(){
 +    localStore.save('todoList', this.state.todoList)
 +  }

  toggle(e,todo){
    todo.status=todo.status==='completed'?'':'completed'
    this.setState(this.state)
  }//toggle
  changeTitle(event){
    this.setState({
      newTodo:event.target.value,
      todoList:this.state.todoList
    })
  }//changeTitle
  addTodo(event){
    this.state.todoList.push({
      id:idMaker(),
      title:event.target.value,
      status:null,
      deleted:false
    })
    this.setState({
      newTodo:'',
      todoList:this.state.todoList
    })
  }//addTodo
  delete(event, todo){
    todo.deleted=true
    this.setState(this.state)
  }//delete
}//class App

export default App;
let id=0
function idMaker(){
  id +=1
  return id
}
