import React, { Component } from 'react';
import 'normalize.css'
import './reset.css'
import './index.css';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut} from './leanCloud'

class App extends Component {
  constructor(props){
    super(props)
//super关键字用于访问父对象上的函数
//调用super的原因：在ES6中，在子类的constructor中必须先调用super才能引用this
//super(props)的目的：在constructor中可以使用this.props
    this.state={
      user: getCurrentUser() || {}, 
      newTodo:'',
      todoList:[]
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
        <h1>{this.state.user.username||'我'}的待办
           {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
          onChange={this.changeTitle.bind(this)}
          onSubmit={this.addTodo.bind(this)}/>
        </div>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ? 
           null : 
           <UserDialog 
             onSignUp={this.onSignUpOrSignIn.bind(this)} 
             onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
      </div>
    )//return
  }//render
  signOut(){
     signOut()
     let stateCopy = JSON.parse(JSON.stringify(this.state))
     stateCopy.user = {}
     this.setState(stateCopy)
   }
  onSignUpOrSignIn(user){
      let stateCopy = JSON.parse(JSON.stringify(this.state)) 
      stateCopy.user = user
      this.setState(stateCopy)
   }
  componentDidUpdate(){
   }

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
