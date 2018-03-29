//Core
import React, { Component } from 'react';
import { string, number } from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Components
import Styles from './styles.scss';
import Task from '../Task';
import Catcher from '../Catcher';
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
        tasks:         [],
        message:       '',
        messageSearch: '',
        stylesParams:  {
            completed: {
                color1: '#3B8EF3',
                color2: '#FFF',
            },
            favorite: {
                color1: '#363636',
                color2: '#3B8EF3',
            },
        },
    };

    componentDidMount () {
        this._fetchTask();
    }

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
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
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
                const favoriteArray = [];
                const unfavoriteArray = [];

                for (const key in taskData) {
                    if (taskData[key].favorite && !taskData[key].completed) {
                        favoriteArray.push(taskData[key]);
                    } else {
                        unfavoriteArray.push(taskData[key]);
                    }
                }

                this.setState({ tasks: [...favoriteArray, data, ...unfavoriteArray]});
            })
            .catch((error) => {
                console.log('_createTask ', error.message);
            });

    };

    _fetchTask = async () => {
        const { api, token } = this.context;

        try {
            const response = await fetch(api, {
                method:  'GET',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error read posts');
            }

            const { data } = await response.json();

            this.setState({ tasks: [...data]});
            this._sortTasks();
        } catch ({ message }) {
            console.log('_fetchTask ', message);
        }
    };

    _sortTasks = () => {
        const { tasks: taskData } = this.state;
        const complitedArray = [];
        const favoriteArray = [];
        const unfavoriteArray = [];

        for (const key in taskData) {
            if (taskData[key].completed) {
                complitedArray.push(taskData[key]);
            } else if (taskData[key].favorite) {
                favoriteArray.push(taskData[key]);
            } else {
                unfavoriteArray.push(taskData[key]);
            }
        }

        this.setState({ tasks: [...favoriteArray, ...unfavoriteArray, ...complitedArray]});
    };

    _completeTask = (id) => {
        const { tasks: taskData } = this.state;

        for (const key in taskData) {
            if (taskData[key].id === id) {
                taskData[key].completed = !taskData[key].completed;
            }
        }

        this._sortTasks();
        this._updateTask(id);
    };

    _completeAllTasks = () => {
        const { tasks: taskData } = this.state;

        /*for (const key in taskData) {
            taskData[key].completed = true;
        }*/
        taskData.map((task) => task.completed = true);

        this.setState({ tasks: taskData });
        this._updateTask();
    };

    _favoriteTask = (id) => {
        const { tasks: taskData } = this.state;

        for (const key in taskData) {
            if (taskData[key].id === id) {
                taskData[key].favorite = !taskData[key].favorite;
            }
        }

        this._sortTasks();
        this._updateTask(id);
    };

    _editTask = (id, message) => {
        const { tasks: taskData } = this.state;

        for (const key in taskData) {
            if (taskData[key].id === id) {
                taskData[key].message = message;
            }
        }

        this.setState({ tasks: taskData });
        this._updateTask(id);
    };

    _updateTask = (id) => {
        if (typeof id === 'undefined') {
            const { tasks: taskData } = this.state;

            taskData.forEach((task) => {
                this._updateOneTask([task]);
            });
        } else {
            const { tasks } = this.state;
            const taskData = tasks.filter((task) => task.id === id);

            this._updateOneTask(taskData);
        }
    };

    _updateOneTask = async (task) => {
        const { api, token } = this.context;

        try {
            const response = await fetch(api, {
                method:  'PUT',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(task),
            });

            if (response.status !== 200) {
                throw new Error('Create error post');
            }
        } catch ({ message }) {
            console.log('_updateTask ', message);
        }
    };

    _deleteTask = async (id) => {
        const { api, token } = this.context;

        try {
            const response = await fetch(`${api}/${id}`, {
                method:  'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            if (response.status !== 204) {
                throw new Error('Delete post failed');
            }

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));


        } catch ({ message }) {
            console.error('_deleteTask ', message);
        }
    };


    render () {
        const { tasks: taskData, message, messageSearch, stylesParams } = this.state;
        const filteredTasks = messageSearch ?
            taskData.filter((task) => task.message.includes(messageSearch))
                .map((task) => (<CSSTransition
                    classNames = { {
                        enter:       Styles.taskInStart,
                        enterActive: Styles.taskInEnd,
                        exit:        Styles.postRmStart,
                        exitActive:  Styles.postRmEnd,
                    } }
                    key = { task.id }
                    timeout = { 700 }>
                    <Catcher key = { task.id }>
                        <Task
                            completeTask = { this._completeTask }
                            deleteTask = { this._deleteTask }
                            editTask = { this._editTask }
                            favoriteTask = { this._favoriteTask }
                            { ...task }
                        />
                    </Catcher>
                </CSSTransition>)
                ) :
            taskData.map((task) => (
                <CSSTransition
                    classNames = { {
                        enter:       Styles.taskInStart,
                        enterActive: Styles.taskInEnd,
                        exit:        Styles.taskRmStart,
                        exitActive:  Styles.taskRmEnd,
                    } }
                    key = { task.id }
                    timeout = { 700 }>
                    <Catcher key = { task.id }>
                        <Task
                            completeTask = { this._completeTask }
                            deleteTask = { this._deleteTask }
                            editTask = { this._editTask }
                            favoriteTask = { this._favoriteTask }
                            { ...task }
                        />
                    </Catcher>
                </CSSTransition>
            ));

        const completeAllTasks = taskData.filter((task) => task.completed === true).length === taskData.length;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            name = { 'messageSearch' }
                            placeholder = { 'Поиск' }
                            value = { messageSearch }
                            onChange = { this._handleKeyPressSearch }
                        />
                    </header>
                    <section>
                        <form
                            onKeyPress = { this._handleKeyPressValidate }
                            onSubmit = { this.handleSubmit }>
                            <input
                                placeholder = { 'Описание моей новой задачи' }
                                value = { message }
                                onChange = { this._handleMessageChange }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        <ul>
                            <TransitionGroup>
                                { filteredTasks }
                            </TransitionGroup>
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
