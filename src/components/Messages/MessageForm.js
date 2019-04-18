import React, { Component } from 'react'
import { Segment, Button, Input } from 'semantic-ui-react';


export class MessageForm extends Component {

	state = {
		channel: this.props.currentChannel,
		message: '',
		loading: false
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	//////
	createMessage = () => {
		const message = {

		}
	}

	sendMessage = () => {
		const { messageRef } = this.props;
		const { message, channel } = this.state
		if (message) {
			this.setState({
				loading: true
			})
			messageRef
				.child(channel.id)
				.push()
				.set(this.createMessage())
		}
	}

	render() {
		return (
			<Segment className="message__form">
				<Input
					fluid
					name="message"
					style={{ marginBottom: '0.7em' }}
					label={<Button icon={'add'} />}
					labelPosition="left"
					onChange={this.handleChange}
					placeholder="Write your message"
				/>
				<Button.Group icon widths="2">
					<Button onClick={this.sendMessage} color="orange" content="Add Reply" labelPosition="left" icon="edit" />

					<Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload" />
				</Button.Group>
			</Segment>
		)
	}
}



export default MessageForm
