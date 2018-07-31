import React, { Component } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import * as apiCalls from './api';

const APIURL = '/api/todos/';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    }
    this.addTodo = this.addTodo.bind(this)
  };

  componentWillMount() {
    this.loadTodos();
  };

  loadTodos() {
    console.log( apiCalls.getTodos() )
    let todos = apiCalls.getTodos();

    // this.setState({todos});
  }

  addTodo(value) {
    fetch(APIURL, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({name: value})
    })
    .then(response => {
      if(!response.ok) {
        if(response.status >=400 && response.status < 500) {
          return response.json().then(data => {
            let err = {errorMessage: data.message};
            throw err;
          })
        } else {
          let err = {errorMessage: 'PLease try again later; server is not responding'}
          throw err;
        }
      }
      return response.json();
    })
    .then(newTodo => {
      this.setState({todos: [...this.state.todos, newTodo]})
    })
  };

  deleteTodo(id) {
    const deleteURL = APIURL + id;
    fetch(deleteURL, {
      method: 'delete'
    })
    .then(response => {
      if(!response.ok) {
        if(response.status >=400 && response.status < 500) {
          return response.json().then(data => {
            let err = {errorMessage: data.message};
            throw err;
          })
        } else {
          let err = {errorMessage: 'PLease try again later; server is not responding'}
          throw err;
        }
      }
      return response.json();
    })
    .then(() => {
      const todos = this.state.todos.filter( todo => todo._id !== id )
      this.setState({todos: todos})
    })
  };

  toggleTodo(todo) {
    const updateURL = APIURL + todo._id;
    fetch(updateURL, {
      method: 'put',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ completed: !todo.completed })
    })
    .then(response => {
      if(!response.ok) {
        if(response.status >=400 && response.status < 500) {
          return response.json().then(data => {
            let err = {errorMessage: data.message};
            throw err;
          })
        } else {
          let err = {errorMessage: 'PLease try again later; server is not responding'}
          throw err;
        }
      }
      return response.json();
    })
    .then(updatedTodo => {
      const todos = this.state.todos.map( t =>
        (t._id === updatedTodo._id)
        ? {...t, completed: !t.completed}
        : t
      )
      this.setState({todos: todos})
    })
  }

  render() {
    const todos = this.state.todos.map((t) => (
      <TodoItem
        key = {t._id}
        {...t}
        onDelete = {this.deleteTodo.bind(this, t._id)}
        onToggle = {this.toggleTodo.bind(this, t)}
      />
    ));
    return (
      <div>
        <h1>Todo List!</h1>
        <TodoForm addTodo = {this.addTodo}/>
        <ul>
          {todos}
        </ul>
      </div>
    )
  }
}

export default TodoList;