import React, {Component} from 'react'

import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './UserDialog'
import copyState from './copyState'
import AV, {getCurrentUser, signOut} from './leanCloud'

import './App.css';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
  }

  render() {
    let todos = this.state.todoList
      .filter((item) => !item.deleted)
      .map((item, index) => {
        return (
          <li key={item.id}>
            <TodoItem todo={item} onToggle={this.toggle}
                      onDelete={this.delete}/>
          </li>
        )
      })

    let mainPage = (
      <div className="mainPage">
        <h1>{ this.state.user.username || '我'}的待办
          { this.state.user.id ? <button onClick={ this.userSignOut }>登出</button> : null}</h1>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
                     onSubmit={this.addTodo}
                     onChange={this.changeTitle}/>
        </div>
        <ol className="todoList">
          {todos}
        </ol>
      </div>
    )
    return (
      <div className="App">
        { this.state.user.id ?
          mainPage :
          <UserDialog
            onSignUp={this.onSignUpOrSignIn}
            onSignIn={this.onSignUpOrSignIn}/> }
      </div>
    )
    /*return (
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
    )//return*/
  }

  componentWillMount() {

    // if (AV.User.current()) {
    //   const query = new AV.Query('AllTodos')
    //   query.find().then((todos) => {
    //
    //     const stateCopy = copyState(this.state)
    //     stateCopy.todoList = JSON.parse(todos[0].attributes.AllTodos)
    //     stateCopy.todoList.id = todos[0].id
    //     this.setState(stateCopy)
    //     console.log(this.state.todoList)
    //
    //   }, (error) => {
    //     console.log(error)
    //   })
    // }
    this.fetchData()
  }

  componentDidUpdate() {

  }

  addTodo = (event) => {
    if (event.target.value) {
      this.state.todoList.push({
        id: idMaker(),
        title: event.target.value,
        status: null,
        deleted: false
      })
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    }
    this.saveOrUpdateData()

  }
  changeTitle = (event) => {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
    this.saveOrUpdateData()

  }
  toggle = (e, todo) => {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
    this.saveOrUpdateData()

  }
  delete = (event, todo) => {
    todo.deleted = true
    this.setState(this.state)
    this.saveOrUpdateData()

  }

  onSignUpOrSignIn = (user) => {
    this.fetchData()
    let stateCopy = copyState(this.state)
    stateCopy.user = user
    this.setState(stateCopy)
  }
  userSignOut = () => {
    signOut()
    let stateCopy = copyState(this.state)
    stateCopy.user = {}
    this.setState(stateCopy)
  }
  saveData = () => {

    let dataString = JSON.stringify(this.state.todoList)

    const AVTodos = AV.Object.extend('AllTodos')
    const avTodos = new AVTodos()
    const acl = new AV.ACL()

    acl.setReadAccess(AV.User.current(), true)
    acl.setWriteAccess(AV.User.current(), true)

    avTodos.set('AllTodos', dataString)
    avTodos.setACL(acl)

    avTodos.save().then((todo) => {
      let stateCopy = copyState(this.state)
      stateCopy.todoList.id = todo.id
      this.setState(stateCopy)
      console.log('保存成功', todo.id)
    }, (error) => {
      console.log('保存失败')
    })

  }
  updateData = () => {
    let dataString = JSON.stringify(this.state.todoList)
    console.log(this.state.todoList)
    let avTodos = AV.Object.createWithoutData('AllTodos',this.state.todoList.id)
    avTodos.set('AllTodos',dataString)
    avTodos.save().then(()=>{
      console.log('更新成功')
    })
  }
  saveOrUpdateData = () => {
    if(this.state.todoList.id){
      this.updateData()
    } else {
      console.log(1)
      this.saveData()
    }
  }
  fetchData=()=>{
    if (AV.User.current()) {
      const query = new AV.Query('AllTodos')
      query.find().then((todos) => {

        const stateCopy = copyState(this.state)
        stateCopy.todoList = JSON.parse(todos[0].attributes.AllTodos)
        stateCopy.todoList.id = todos[0].id
        this.setState(stateCopy)
        console.log(this.state.todoList)

      }, (error) => {
        console.log(error)
      })
    }
  }


}

export default App

let id = 0
function idMaker() {
  id += 1
  return id
}