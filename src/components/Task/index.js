//Core
import React, { Component, Fragment } from 'react';
import { string, bool, func } from 'prop-types';

// Components
import Styles from './styles.scss';
import Checkbox from '../../theme/assets/Checkbox';
import Delete from '../../theme/assets/Delete';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';


export default class Task extends Component {
    static propTypes = {
        completed:    bool.isRequired,
        completeTask: func.isRequired,
        created:      string.isRequired,
        deleteTask:   func.isRequired,
        editTask:     func.isRequired,
        favorite:     bool.isRequired,
        favoriteTask: func.isRequired,
        id:           string.isRequired,
        message:      string.isRequired,
    };


    state = {
		messageEditStatus: false,
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
		const { messageEditStatus, message } = this.state;

		if(messageEditStatus){
            editTask(id, message);
		}

		this.setState({
			messageEditStatus: !messageEditStatus,
		});

    };

    _handleMessageChange = ({ target: { value }}) => {
        if (value ){
            this.setState({
                message: value,
            });
        }
    };

    _handleKeyPressEsc = (event) => {
        if (event.keyCode == 27 || event.key === 'Esc') {
            this.setState({
                messageEditStatus: false,
            });
        }
    };

    _onDelete = () => {
        const { deleteTask, id } = this.props;
        deleteTask(id);
    };

    render () {
        const { message, favorite, completed } = this.props;
        const { stylesParams, messageEditStatus } = this.state;

        return (
            <Fragment>
                <li className = { completed ? `${Styles.task} ${Styles.completed}`: `${Styles.task}` }>
					<div>
						<span onClick = { this._onComplete }>
							<Checkbox
								color1 = { stylesParams.completed.color1 }
								color2 = { stylesParams.completed.color2 }
								checked = { completed }
							/>
						</span>
						{ messageEditStatus ?
                                <span>
                                    <input
                                        defaultValue = { message }
                                        name = 'editMessage'
                                        type = 'text'
                                        onChange = { this._handleMessageChange }
                                        onKeyDown = { this._handleKeyPressEsc }
                                    />
                                </span>
							: <span>{message}</span> }
					</div>
                    <div>
						<Star
							checked = { favorite }
							color1 = { stylesParams.favorite.color1 }
							color2 = { stylesParams.favorite.color2 }
							onClick = { this._onFavorite }
						/>
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
                    </div>
                </li>
            </Fragment>
        );
    }
}
