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
        favorite:        bool.isRequired,
        favoriteTask:    func.isRequired,
        id:              string.isRequired,
        message:         string.isRequired,
    };


    state = {
        color: {
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

    _onDelete = () => {
        const { deleteTask, id } = this.props;
        deleteTask(id);
    };

    render () {
        const { message, favorite, completed } = this.props;
        const { color } = this.state;

        return (
            <Fragment>
                <div className = { completed ? `${Styles.task} ${Styles.completed}`: `${Styles.task}` }>
                    <span onClick = { this._onComplete }>
                        <Checkbox
                            color1 = { color.completed.color1 }
                            color2 = { color.completed.color2 }
                        />
                    </span>

                        {/*<input value = { message } />*/}
                    <span>{message}</span>

                    <div>
                        <span>
                            <span onClick = { this._onFavorite }>
                                <Star
                                    color1 = { color.favorite.color1 }
                                    color2 = { color.favorite.color2 }
                                />
                            </span>
                            <Edit
                                color1 = { color.favorite.color1 }
                                color2 = { color.favorite.color2 }
                            />
                            <Delete
                                color1 = { color.favorite.color1 }
                                color2 = { color.favorite.color2 }
                                onClick = { this._onDelete }
                            />
                        </span>
                    </div>
                </div>
            </Fragment>
        );
    }
}
