import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase';
import Message from './Message'

class Messages extends Component {

	state = {
		privateChannel: this.props.isPrivateChannel,
		privateMessagesRef: firebase.database().ref('privateMessages'),
		messagesRef: firebase.database().ref('messages'),
		channel: this.props.currentChannel,
		user: this.props.currentUser,
		messages: [],
		messagesLoading: true,
		numUniqeUsers: '',
		searchTerm: '',
		searchLoading: false,
		searchResults: []
	}
	componentDidMount() {
		const { channel, user, messages } = this.state;

		if (channel && user) {
			this.addListeners(channel.id)
		}
	}


	addListeners = channelId => {
		this.addMessageListener(channelId);
	}
	addMessageListener = channelId => {
		let loadedMessages = [];
		const ref = this.getMessagesRef();
		ref.child(channelId)
			.on('child_added', snap => {
				loadedMessages.push(snap.val())
				this.setState({
					messages: loadedMessages,
					messagesLoading: false
				})
				this.countUniqueUsers(loadedMessages)
			})
	}


	countUniqueUsers = messages => {
		const uniqueUsers = messages.reduce((acc, message) => {
			if (!acc.includes(message.user.name)) {
				acc.push(message.user.name);
			}
			return acc;
		}, []);
		const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
		const numUniqeUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
		this.setState({
			numUniqeUsers
		})
	}

	handleSearchChange = e => {
		this.setState({
			searchTerm: e.target.value,
			searchLoading: true
		}, () => this.handleSearchMessages())
	}

	getMessagesRef = () => {
		const { messagesRef, privateMessagesRef, privateChannel } = this.state;
		return privateChannel ? privateMessagesRef : messagesRef;
	}

	handleSearchMessages = () => {
		const channelMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, 'gi');
		const searchResults = channelMessages.reduce((acc, message) => {
			if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
				acc.push(message);
			}
			return acc;
		}, [])
		this.setState({
			searchResults
		})
		setTimeout(() => this.setState({ searchLoading: false }), 1000);
	}


	displayMessages = messages => (
		messages.length > 0 && messages.map(message => (
			<Message
				key={message.timestamp}
				message={message}
				user={this.state.user} />
		))
	)
	displayChannelName = channel => {

		return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
	}


	render() {
		const { messagesRef, messages, channel, user, numUniqeUsers, searchTerm, searchResults, searchLoading, privateChannel } = this.state
		return (
			<React.Fragment>
				<MessagesHeader
					numUniqeUsers={numUniqeUsers}
					channelName={this.displayChannelName(channel)}
					handleSearchChange={this.handleSearchChange}
					searchLoading={searchLoading}
					isPrivateChannel={privateChannel}
				/>
				<Segment>
					<Comment.Group

						className="messages">
						{searchTerm ? this.displayMessages(searchResults) :
							this.displayMessages(messages)}
					</Comment.Group>
				</Segment>
				<MessageForm
					messagesRef={messagesRef}
					currentChannel={channel}
					currentUser={user}
					searchLoading={searchLoading}
					isPrivateChannel={privateChannel}
					getMessagesRef={this.getMessagesRef} />
			</React.Fragment>
		)
	}
}


export default Messages