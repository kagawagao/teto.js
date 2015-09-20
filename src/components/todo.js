import React, { PropTypes } from 'react'
import styles from './todo.css'

export default class Todo extends React.Component {

  static propTypes = {
    todo: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      editing: false
    }
  }

  onClick () {
    this.setState({
      editing: true
    })
  }

  onBlur () {
    this.setState({
      editing: false
    })
  }

  render () {
    let { todo, editTodo, completeTodo } = this.props
    return (
        this.state.editing ?
        <li>
          <input
            type="text"
            value={todo.text} />
        </li> :
        <li className={todo.completed ? styles.completed : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo.id)} />
          <label>{todo.text}</label>
        </li>
    )
  }
}