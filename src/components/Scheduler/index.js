//Core
import React, { Component } from 'react';
import { string, number } from 'prop-types';

// Components
import Styles from './styles.scss';
import Task from '../Task';
import Catcher from '../Catcher';
import moment from 'moment';
import Checkbox from '../../theme/assets/Checkbox';

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
        tasks:   	      [],
        message:  	      '',
		messageSearch:    '',
		completeAllTasks: false,
		stylesParams:     {
					completed: {
						color1: '#3B8EF3',
						color2: '#FFF',
					},
					favorite: {
						color1: '#363636',
						color2: '#3B8EF3',
					},
				},
        isFetching: false,
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

    _handleKeyPressValidate = (event) => {
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
        const { api, token } = this.context;
        fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ message }),
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Create error post');
                }
                return response.json();
            })
            .then(({ data }) => {
                const { tasks: taskData } = this.state;
                const favoriteArray = [], unfavoriteArray = [];

                for (let key in taskData) {
                    if (taskData[key].favorite && !taskData[key].completed ) {
                        favoriteArray.push(taskData[key]);
                    } else {
                        unfavoriteArray.push(taskData[key]);
                    }
                }

                this.setState({ tasks: [...favoriteArray, data, ...unfavoriteArray] });
            })
            .catch((error) => {
                console.log('_createTask ', error.message);
            });

    };

	_updateTask = async (id) => {

		const { api, token } = this.context;
		const { tasks } = this.state;
		const updateTask = tasks.filter((task) => task.id === id);

		try {
			const response = await fetch(api, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(updateTask),
			})

			if (response.status !== 200) {
				throw new Error('Create error post');
			}

			// const { data } = await response.json();

		}
		catch({ message }) {
			console.log('_updateTask ', message);
		}
	};

    componentDidMount () {
        this._fetchTask();
    };

    _fetchTask = async () => {
        const { api, token } = this.context;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error read posts');
            }

            const { data } = await response.json();

            this.setState({ tasks: [...data] });
			this._sortTasks();

        } catch ({ message }) {
            console.log('_fetchTask ', message);
        }
    };

    _sortTasks = () => {
		const { tasks: taskData } = this.state;
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
		if (favoriteArray || unfavoriteArray){
			this.setState({ completeAllTasks: false });
		}

		this.setState({ tasks: [...favoriteArray, ...unfavoriteArray, ...complitedArray] });
	}

    _completeTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'complite'
        for (let key in taskData) {
            taskData[key].completed = (taskData[key].id === id) ? !taskData[key].completed : taskData[key].completed;
        }

        this._sortTasks();
        this._updateTask(id);
    };

	_completeAllTasks = () => {
        const { tasks: taskData, completeAllTasks } = this.state;
        for (let key in taskData) {
            taskData[key].completed = true;
        }
        this.setState({ tasks: taskData, completeAllTasks: true });
        //TODO make update for all tickets   this._updateTask(id);
    };

    _favoriteTask = (id) => {
        const { tasks: taskData } = this.state;

        //Replace status 'favorite'
        for (let key in taskData) {
            taskData[key].favorite = taskData[key].id === id ? !taskData[key].favorite : taskData[key].favorite;
        }

		this._sortTasks();
		this._updateTask(id);
    };

    _editTask = (id, message) => {
        const { tasks: taskData } = this.state;

        for (let key in taskData) {
            taskData[key].message = (taskData[key].id === id) ? message : taskData[key].message;
        }

        this.setState({ tasks: taskData });
		this._updateTask(id);
    };

    _deleteTask = async (id) => {
        const { api, token } = this.context;

        try {
            const response = await fetch(`${api}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            if (response.status !== 204) {
                throw new Error('Delete post failed');
            }

            const { completeAllTasks } = this.state;
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
            this.setState(({ tasks }) => ({
                completeAllTasks: tasks.length > 0 ? completeAllTasks : false,
            }));

        } catch ({ message }) {
            console.error('_deleteTask ', message);
        }
    };


    render () {
        const { tasks: taskData, message, messageSearch, stylesParams, completeAllTasks } = this.state;

		const filteredTasks = messageSearch ? taskData
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
                            onKeyPress = { this._handleKeyPressValidate }
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
                        { filteredTasks }
                        </ul>
                    </section>
                    <footer>
							<span onClick = { this._completeAllTasks }>
                            <Checkbox
								checked = { completeAllTasks }
								color1 = { stylesParams.completed.color1 }
								color2 = { stylesParams.completed.color2 }
							/>
                        </span>
							<code>Все задачи выполнены</code>
                    </footer>
                </main>
            </section>
        );
    }
}
