import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoList from '../components/TodoList'
import * as filters from '../constants/FilterShow';

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case filters.SHOW_ALL:
            return todos;
        case filters.SHOW_COMPLETED:
            return todos.filter((t) => t.completed);
        case filters.SHOW_ACTIVE:
            return todos.filter((t) => !t.completed)
    }
}

const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id))
        }
    }
}

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)

export default VisibleTodoList;