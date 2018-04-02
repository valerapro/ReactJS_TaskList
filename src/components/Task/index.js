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

        if (messageEditStatus) {
            editTask(id, message);
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
        const { stylesParams, messageEditStatus } = this.state;

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
                        { messageEditStatus ?
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
                            : <span>{message}</span> }
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
