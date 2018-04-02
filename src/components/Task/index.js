//Core
import React, { Component, Fragment } from 'react';
import { string, bool, func } from 'prop-types';

// Components
import Styles from './styles.scss';
import Palette from '../../theme/palette.scss';
import Checkbox from '../../theme/assets/Checkbox';
import Delete from '../../theme/assets/Delete';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';


export default class Task extends Component {
    static propTypes = {
		updateTasks:  func.isRequired,
        completed:    bool.isRequired,
        deleteTask:   func.isRequired,
        favorite:     bool.isRequired,
        id:           string.isRequired,
        message:      string.isRequired,
    };

    state = {
        messageEditStatus: false,
    };

    _onComplete = () => {
        const { updateTasks, id, message, completed, favorite } = this.props;

		updateTasks([{
			id,
			message,
			completed: !completed,
			favorite,
		}]);
    };

    _onFavorite = () => {
		const { updateTasks, id, message, completed, favorite } = this.props;

		updateTasks([{
			id,
			message,
			completed,
			favorite: !favorite,
		}]);
    };

    _onEdit = () => {
        const { updateTasks, id, completed, favorite } = this.props;
        const { messageEditStatus, message } = this.state;

        if (messageEditStatus) {
			updateTasks([{
				id,
				message: message.trim(),
				completed,
				favorite,
			}]);
        }

        this.setState({
            messageEditStatus: !messageEditStatus,
        });

    };

    _handleMessageChange = ({ target: { value }}) => {
        if (value) {
            this.setState({
                message: value,
            });
        }
    };

    _handleKeyPressEsc = (event) => {
        if (event.keyCode === 27 || event.key === 'Esc') {
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
        const { messageEditStatus } = this.state;
		const messageView = messageEditStatus ?
			<span>
                                <input
									autoFocus
									defaultValue = { message }
									name = 'editMessage'
									type = 'text'
									onChange = { this._handleMessageChange }
									onKeyDown = { this._handleKeyPressEsc }
								/>
                            </span>
			: <span>{message}</span>;

        return (
            <Fragment>
                <li className = { completed ? `${Styles.task} ${Styles.completed}`: `${Styles.task}` }>
                    <div>
                        <span onClick = { this._onComplete }>
                            <Checkbox
                                checked = { completed }
								color1 = { Palette.paletteColor3 }
								color2 = { Palette.paletteColor4 }
                            />
                        </span>
                        { messageView }
                    </div>
                    <div>
                        <Star
                            checked = { favorite }
                            color1 = { Palette.paletteColor3 }
                            color2 = { Palette.paletteColor1 }
                            onClick = { this._onFavorite }
                        />
                        <Edit
							color1 = { Palette.paletteColor3 }
							color2 = { Palette.paletteColor1 }
                            onClick = { this._onEdit }
                        />
                        <Delete
							color1 = { Palette.paletteColor3 }
							color2 = { Palette.paletteColor1 }
                            onClick = { this._onDelete }
                        />
                    </div>
                </li>
            </Fragment>
        );
    }
}
