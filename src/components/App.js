import React from 'react';
import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';
import Connect from './Connect';

const App = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
        <Connect />
    </div>
)

export default App