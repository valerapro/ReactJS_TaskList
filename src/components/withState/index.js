import React, {Component} from 'react';

import {string} from "prop-types";
import io from "socket.io-client";
import Feed from '../Feed';

export default (Injectable) => {
    class Enhancer extends Component {

        static contextTypes = {
            api:   string.isRequired,
            token: string.isRequired
        }

        state = {
            posts:      [],
            isFetching: false,
            isPostman:  true
        }


        componentDidMount () {
            const socket = io('https://lab.lectrum.io', {
                path: '/react/ws'
            });

            socket.on('connect', () => {
                console.log(`Socket connected with ID: ${socket.id}`);
            });

            socket.on('disconnect', () => {
                console.log(`Socket disconnected with no ID: ${socket.id}`);
            });


            socket.emit('join', '1fwfsc9M9A');

            socket.on('join_error', (data) => {
                console.error(JSON.parse(data).message);
            });

            socket.on('create', (data) => {
                const post = JSON.parse(data);

                // console.log(post); //dev

                this.setState(({ posts }) => ({
                    posts:         [ post, ...posts ],
                }));
                this._stopFetch();
            });

            socket.on('like', (likedPost) => {
                // console.log(likedPost); //dev
                this.setState(({ posts }) => ({
                    posts: posts.map((post) => {
                        return JSON.parse(likedPost).id === post.id
                            ? JSON.parse(likedPost)
                            : post;
                    })
                }));

            });

            socket.on('remove', (id) => {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== id),
                    isFetching: false
                }));
            })

            this._fetchGet();
        }

        _startFetch = () => {
            this.setState({
                isFetching: true
            });
        }

        _stopFetch = () => {
            this.setState({
                isFetching: false
            });
        }

        _createPost = (comment) => {
            this._startFetch();

            const { api, token } = this.context;
            fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ comment })
            })
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('Create error post');
                    }
                    return response.json();
                })

                .catch((error) => {
                    console.log(error.message);
                });
        }

        /*_fetchPost */
        _fetchGet = async () => {

            const { api } = this.context;

            try {
                this._startFetch();
                const response = await fetch(api, {
                    method: 'GET'
                });

                if (response.status !== 200) {
                    throw new Error('Error read posts');
                }

                // const { data } = response.json(); //dev
                // console.log(data);//dev

                const { data } = await response.json();
                // console.log(data); //dev

                this.setState(({ posts }) => ({
                    posts: [ ...data, ...posts ],
                    isFetching: false
                }));
            } catch ({ message }) {
                this._stopFetch();
                console.log( message );
            } finally {


            }


        };

        _deletePost = async (id) => {
            const {api, token} = this.context;

            try {
                this._startFetch();
                const response = await fetch(`${api}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status !== 204) {
                    throw new Error('Delete post failed');
                }

            } catch ({ message }) {
                this._startFetch();
                console.error(message);
            }
        }

        _likePost = async (id) => {
            const { api, token } = this.context;

            // console.log('token --- ', token); //dev

            const response = await fetch(`${api}/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token
                }
            });

            const { data } = await response.json();

            this.setState(({ posts }) => ({
                posts: posts.map((post) => post.id === id ? data : post )
            }));

        }

        render () {
            // console.log('state' , this.state); //dev

            return <Injectable
                createPost = { this._createPost }
                deletePost = { this._deletePost }
                likePost = { this._likePost }
                { ...this.state }
            />;
        }
    }

    return Enhancer;
};