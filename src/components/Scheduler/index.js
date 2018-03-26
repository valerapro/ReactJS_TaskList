//Core
import React, { Component } from 'react';
import {string, number, boolean} from 'prop-types';

// Components
import Styles from './styles.scss';
import Task from '../Task';
import Catcher from '../Catcher';
import moment from 'moment';
import { getUniqueID } from '../../helpers';

export default class Scheduler extends Component {
    static contextTypes = {
        api:           string.isRequired,
        token:         string.isRequired,
        messageLength: number.isRequired,
    };

    constructor () {
        super();
        this.handleSubmit = ::this._handleSubmit;
    }

    state = {
        tasks:   	   [],
        message:  	   '',
		messageSearch: '',
    };

    _handleSubmit (event) {
        event.preventDefault();
        const { message } = this.state;
        const { messageLength } = this.context;
        if (message.trim() && message.trim().length < messageLength) {
            this._createTask(message);
            this.setState({ message: '' });
            this.setState({ messageSearch: '' });
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

	_handleKeyPressSearch = ({ target: { value }}) => {
		 this.setState({
			 messageSearch: value.trim(),
		 });
	 };

    _createTask = (message) => {
        const newTask = {
            id:        getUniqueID(),
            message,
            completed: false,
            favorite:  false,
            created:   moment().format('MMMM D h:mm:ss a'),
        };

        const { tasks: taskData } = this.state;
        const favoriteArray = [], unfavoriteArray = [];

        for (let key in taskData) {
            if(taskData[key].favorite && !taskData[key].completed ) {
                favoriteArray.push(taskData[key]);
            } else {
                unfavoriteArray.push(taskData[key]);
            }
        }

        this.setState({ tasks: [...favoriteArray, newTask, ...unfavoriteArray] });
    };

    _completeTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'complite'
        for (let key in taskData) {
            taskData[key].completed = (taskData[key].id === id) ? !taskData[key].completed : taskData[key].completed;
        }

          //Sort tasks
        const complitedArray = [],
            uncomplitedArray = [],
            favoriteArray = [],
            unfavoriteArray = [];
        for (let key in taskData) {
            if (taskData[key].completed) {
                complitedArray.push(taskData[key]);
            } else {
                if (taskData[key].favorite) {
                    favoriteArray.push(taskData[key]);
                } else {
                    unfavoriteArray.push(taskData[key]);
                }
            }
        }

        this.setState({ tasks: [...favoriteArray, ...unfavoriteArray, ...complitedArray] });
    };


    _favoriteTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'favorite'
        for (let key in taskData) {
            taskData[key].favorite = taskData[key].id === id ? !taskData[key].favorite : taskData[key].favorite;
        }

        //Sort tasks
        const complitedArray = [],
            favoriteArray = [],
            unfavoriteArray = [];
        for (let key in taskData) {

            if (taskData[key].completed) {
                complitedArray.push(taskData[key]);
            } else {
                if (taskData[key].favorite) {
                    favoriteArray.push(taskData[key]);
                } else {
                    unfavoriteArray.push(taskData[key]);
                }
            }
        }
        this.setState({ tasks: [...favoriteArray, ...unfavoriteArray, ...complitedArray] });
    };

    _editTask = (id) => {
        console.log('--- id ', id);

    }

    _deleteTask = (id) => {
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
    };

    render () {
        const { tasks: taskData, message, messageSearch } = this.state;

		const tasks = messageSearch ? taskData
			.filter((task) => task.message.includes(messageSearch))
			.map((task) =>
				<Catcher key = { task.id }>
					<Task
						completeTask = { this._completeTask }
						deleteTask = { this._deleteTask }
						editTask = { this._editTask }
						favoriteTask = { this._favoriteTask }
						{ ...task }
					/>
				</Catcher>
			) :
			taskData.map((task) => (
				<Catcher key = { task.id }>
					<Task
						completeTask = { this._completeTask }
						deleteTask = { this._deleteTask }
						editTask = { this._editTask }
						favoriteTask = { this._favoriteTask }
						{ ...task }
					/>
				</Catcher>
			));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
						<input
						 name = { 'messageSearch' }
						 value = { messageSearch }
						 onChange = { this._handleKeyPressSearch }
						 placeholder = { 'Поиск' }
						 />
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
                        <ul>
                        { tasks }
                        </ul>
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
