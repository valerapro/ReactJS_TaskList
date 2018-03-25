//Core
import React, { Component } from 'react';
import {string, number, boolean} from 'prop-types';

// Components
import Styles from './styles.scss';
import Task from '../Task';
import Catcher from '../Catcher';
import moment from 'moment';
import { getUniqueID } from '../../helpers';
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {
    static contextTypes = {
        api:            string.isRequired,
        token:          string.isRequired,
        messageLength:  number.isRequired,
    };

    constructor () {
        super();
        this.handleSubmit = ::this._handleSubmit;
    }

    state = {
        tasks:    [],
        message:  '',
    };

    _handleSubmit (event) {
        event.preventDefault();
        const { message } = this.state;
        const { messageLength } = this.context;
        if (message.trim() && message.trim().length < messageLength) {
            this._createTask(message);
            this.setState({ message: '' });
        }
    }

    _handleMessageChange = ({ target: { value }}) => {
        this.setState({
            message: value,
        });
    };

    _hadleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this._handleSubmit;
        }
    };

    _createTask = (message) => {
        const newTask = {
            id:        getUniqueID(),
            message,
            completed: false,
            favorite:  false,
            created:   moment().format('MMMM D h:mm:ss a'),
        };

        this.setState(({ tasks }) => ({
            tasks: [newTask, ...tasks],
        }));

        // console.log(this.state.tasks); //dev


        // this._sortTaskByPrior(newTask);
    };

    _sortTaskByPrior = (taskMove) => {
        const { tasks: taskData } = this.state;

        console.log(this.state); //dev
        console.log(' ------- '); //dev
        console.log(taskData); //dev


        if (!taskMove.favorite) {

            taskData.sort((a, b) => {
                if (a.favorite === false) {
                    return 1;
                }
                return 0;
            });

            // this.setState({ tasks: [...taskData] });

            // console.log(taskData); //dev
        }
    };


    _completeTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'complite'
        for (let key in taskData) {
            taskData[key].completed = (taskData[key].id === id) ? !taskData[key].completed : taskData[key].completed;
        }

        //Sort tasks
        taskData.sort((a, b) => {
            if (a.completed === true) {
                return 1;
            }
            return 0;
        });
        this.setState({ tasks: taskData });
    };

    _favoriteTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'favorite'
        for (let key in taskData) {
            taskData[key].favorite = (taskData[key].id === id) ? !taskData[key].favorite : taskData[key].favorite;
        }

        //Sort tasks
        taskData.sort((a, b) => {
            if (a.completed === true) {
                return 0;
            }

            if (a.favorite === false) {
                return 1;
            }

            return 0;
        });
        this.setState({ tasks: taskData });


        console.log('------ _favoriteTask  ', taskData); //dev
    };

    _deleteTask = (id) => {
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
    };

    render () {
        const { tasks: taskData, message } = this.state;
        const tasks = taskData.map((task) => (
            <Catcher key = { task.id }>
                <Task
                    completed = { task.completed }
                    completeTask = { this._completeTask }
                    created = { task.created }
                    deleteTask = { this._deleteTask }
                    favorite = { false }
                    favoriteTask = { this._favoriteTask }
                    id = { task.id }
                    message = { task.message }
                />
            </Catcher>
        ));

        // console.log('taskData ', taskData);  //dev

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = { 'Поиск' } />
                    </header>
                    <section>
                        <form
                            onKeyPress = { this._hadleKeyPress }
                            onSubmit = { this.handleSubmit }
                        >
                            <input
                                placeholder = { 'Описание моей новой задачи' }
                                value = { message }
                                onChange = { this._handleMessageChange }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        { tasks }
                    </section>
                    {/*<footer>*/}
                        {/*<span>*/}
                            {/*<Checkbox />*/}
                        {/*</span>*/}
                        {/*<code>*/}
                            {/*Все задачи выполнены*/}
                        {/*</code>*/}
                    {/*</footer>*/}
                </main>
            </section>
        );
    }
}
