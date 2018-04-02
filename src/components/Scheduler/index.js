//Core
import React, { Component } from 'react';
import { string, number } from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Components
import Styles from './styles.scss';
import Palette from '../../theme/palette.scss';
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
            this.setState({
                message:       '',
                messageSearch: '',
            });
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

    /**
	 *
	 * @param message
	 * @returns {Promise.<void>}
	 * @private
	 */
    _createTask = async (message) => {
        const { api, token } = this.context;
        const { tasks } = this.state;

        try {
            const response = await fetch(api, {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ message }),
            });

            if (response.status !== 200) {
                throw new Error('Create error post');
            }
            const { data } = await response.json();

            this.setState({ tasks: [data, ...tasks]});

        } catch ({ error }) {
            console.log('_createTask ', error);
        }

    };

    /**
	 *
	 * @returns {Promise.<void>}
	 * @private
	 */
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

    /**
	 *
	 * @private
	 */
 _sortTasks = () => {
 	console.log('_sortTasks started !!!');

     const { tasks: taskData } = this.state;
     const favoriteTask = taskData.filter((task) => task.favorite === true && task.completed === false);
     const notFavoriteTask = taskData.filter((task) => task.favorite === false && task.completed === false);
     const complitedTask = taskData.filter((task) => task.completed === true);

     this.setState({ tasks: [...favoriteTask, ...notFavoriteTask, ...complitedTask]});
 };

    /**
	 *
	 * @param id
	 * @private
	 */
    _completeTask = (id) => {
        this._updateTask(id, 'completed');
    };

    _completeAllTasks = () => {
        // const { tasks: taskData } = this.state;
		//
        // taskData.map((task) => task.completed = true);
		//
        // this.setState({ tasks: taskData });
        // this._updateTask();

		// this._updateTask(id, 'completeAllTasks');
    };

    /**
	 *
	 * @param id
	 * @private
	 */
    _favoriteTask = (id) => {
        this._updateTask(id, 'favorite');
    };

    /**
	 *
	 * @param id
	 * @param message
	 * @private
	 */
    _editTask = (id, message) => {
        this._updateTask(id, 'message', message);
    };

    _updateTask = async (id, param, value) => {
        const { api, token } = this.context;
        const { tasks: taskData } = this.state;
        let taskEdited = taskData.filter((task) => task.id === id);

        switch (param) {
            case 'completed':
                taskEdited = taskEdited.map((task) => ({
                    id:        task.id,
                    completed: !task.completed,
                    favorite:  task.favorite,
                    message:   task.message,
                }));
                break;
            case 'favorite':
                taskEdited = taskEdited.map((task) => ({
                    id:        task.id,
                    completed: task.completed,
                    favorite:  !task.favorite,
                    message:   task.message,
                }));
                break;
            case 'message':
                taskEdited = taskEdited.map((task) => ({
                    id:        task.id,
                    completed: task.completed,
                    favorite:  task.favorite,
                    message:   value,
                }));
                break;
            default:
                break;
        }


        // console.log('param', param); //dev
        // console.log('param to set', ...taskEdited); //dev
        try {
            const response = await fetch(api, {
                method:  'PUT',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(taskEdited),
            });

            if (response.status !== 200) {
                throw new Error('Create error post');
            }
            const { data } = await response.json();

            // console.log('Data is geted ', data[0]);
            // console.log('ffffffffffffff', taskData.map((task) => data[0].id === task.id ? data[0] : task)); //dev


            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => data[0].id === task.id ? data[0] : task),
            }));
            // this._sortTasks;


        } catch ({ error }) {
            console.log('_updateTask ', error);
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
        const { tasks: taskData, message, messageSearch } = this.state;
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
                                color1 = { Palette.paletteColor3 }
                                color2 = { Palette.paletteColor4 }
                            />
                        </span>
                        <code>Все задачи выполнены</code>
                    </footer>
                </main>
            </section>
        );
    }
}
