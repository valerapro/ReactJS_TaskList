//Core
import React, {Component, Fragment} from 'react';
import { string, bool, func } from 'prop-types';

// Components
import Styles from './styles.scss';
import moment from 'moment/moment';
import Checkbox from '../../theme/assets/Checkbox';
import Delete from '../../theme/assets/Delete';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';


export default class Task extends Component {
    static propTypes = {
        completed:       bool.isRequired,
        completeTask:    func.isRequired,
        created:         string.isRequired,
        deleteTask:      func.isRequired,
        editTask:        func.isRequired,
        favorite:        bool.isRequired,
        favoriteTask:    func.isRequired,
        id:              string.isRequired,
        message:         string.isRequired,
    };


    state = {
        stylesParams: {
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

    _onComplete = () => {
        const { completeTask, id } = this.props;
        completeTask(id);
    };

    _onFavorite = () => {
        const { favoriteTask, id } = this.props;
        favoriteTask(id);
    };

    _onEdit = () => {
        const { editTask, id } = this.props;
        editTask(id);
    };

    _onDelete = () => {
        const { deleteTask, id } = this.props;
        deleteTask(id);
    };


    _handleSubmit(event) {
        event.preventDefault();
    }

    _handleMessageChange = ({ target: { value }}) => {
        this.setState({
            message: value,
        });
    };

    _hadleKeyPress = (event) => {
        if (event.key === 'Esc') {

        }
    };


    render () {
        const { message, favorite, completed } = this.props;
        const { stylesParams } = this.state;

        return (
            <Fragment>
                <li className = { completed ? `${Styles.task} ${Styles.completed}`: `${Styles.task}` }>
                    <span onClick = { this._onComplete }>
                        <Checkbox
                            color1 = { stylesParams.completed.color1 }
                            color2 = { stylesParams.completed.color2 }
							checked = { completed }
                        />
                    </span>


                    <input
                    name = 'name'
                    type = 'text'
                    value = { message }
                    onChange = { this._handleSubmit }
                     />

                    {/*<span>{message}</span>*/}

                    <div>
                        <span>
                            <span onClick = { this._onFavorite }>
                                <Star
                                    color1 = { stylesParams.favorite.color1 }
                                    color2 = { stylesParams.favorite.color2 }
                                />
                            </span>
                            <Edit
                                onClick = { this._onEdit }
                                color1 = { stylesParams.favorite.color1 }
                                color2 = { stylesParams.favorite.color2 }
                            />
                            <Delete
                                color1 = { stylesParams.favorite.color1 }
                                color2 = { stylesParams.favorite.color2 }
                                onClick = { this._onDelete }
                            />
                        </span>
                    </div>
                </li>
            </Fragment>
        );
    }
}
