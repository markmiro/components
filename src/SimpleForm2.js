import React, { Component } from 'react';
import queryString from 'query-string';
import {
  Input,
  Label,
  Select,
  ButtonPrimary,
  InputMessage,
  VerticalSpacer,
} from './FormComponents';
import validator from './validationSchemas';

// TODO: If error and typing then don't show new error until blur, but still show success immediately
// TODO: Make sure success appears right away when two fields are dependant on each other

const trace = (input) => {
	console.log(input);
	return input;
}

const MAX_TWEET_LENGTH = validator.isValid.tweetLength.MAX_TWEET_LENGTH;
const validateWithMessage = {
	required: text => (
		!validator.isValid.exists(text) && validator.messageTemplate.error('Required') ||
		validator.messageTemplate.NONE
	),
	email: email => (
		!validator.isValid.email(email) && validator.messageTemplate.error('Email is invalid') ||
		validator.messageTemplate.NONE
	),
	emailConfirm: email => emailToCheck => (
		email !== emailToCheck && validator.messageTemplate.error('Email is not the same') ||
		validator.messageTemplate.NONE
	),
	tweetLength: tweet => (
		!validator.isValid.tweetLength(tweet) && validator.messageTemplate.error(`${tweet.length - MAX_TWEET_LENGTH} character${tweet.length - MAX_TWEET_LENGTH === 1 ? '' : 's'} over`) ||
		validator.messageTemplate.info(`${tweet.length}/${MAX_TWEET_LENGTH}`)
	)
};

class LabeledInputWithValidation extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { value, label, validate, message, onChange, onBlur, ...rest } = this.props;
		return (
			<div>
				<Label status={message.status}>{label}</Label>
				<Input
					value={value}
					status={message.status}
					{...rest}
					onChange={(...args) => {
						if (onChange) {
							onChange(...args);
						}
						if (message.status === 'error' && validate) {
							validate(...args);
						}
					}}
					onBlur={(...args) => {
						if (onBlur) {
							onBlur(...args);
						}
						if (validate) {
							validate(...args);
						}
					}}
				/>
				{message.body &&
					<InputMessage status={message.status}>
						{message.body}
					</InputMessage>
				}
			</div>
		);
	}
}

const NO_MESSAGES = {
	name: validator.messageTemplate.NONE,
	email: validator.messageTemplate.NONE,
	emailConfirm: validator.messageTemplate.NONE,
};

export default class SimpleForm2 extends Component {
	constructor(props) {
		super(props);
		const fromQueryString = queryString.parse(window.location.search);
		const defaults = {
			name: '',
			email: '',
			emailConfirm: '',
			...fromQueryString,
		};
		this.state = {
			...defaults,
			// TODO: make this show up properly for empty fields
			// messages: validator.validateAgainstMultiple(defaults, this.validationMessages(defaults)),
			messages: NO_MESSAGES,
		};
	}

	setValidationMessage(stateKey, messageValidator) {
		// this.setState(validator.validateItem(stateKey, messageValidator))
		this.setState(prevState => ({
			messages: {
				...prevState.messages,
				[stateKey]: validator.validateAgainst(prevState[stateKey], messageValidator)
			}
		}))
	}

	validationMessages(state) {
		const validationMessages = {
			name: [validateWithMessage.tweetLength],
			email: [validateWithMessage.required, validateWithMessage.email],
			emailConfirm: [validateWithMessage.required, validateWithMessage.emailConfirm(state.email)],
		};
		return validationMessages;
	}

	render() {
		const validationMessages = this.validationMessages(this.state);
		return (
			<form
				action="/"
				method="get"
				onSubmit={e => {
					e.preventDefault();
					const target = e.target;
					this.setState(prevState => ({
						messages: validator.validateAgainstMultiple(prevState, validationMessages)
					}), () => {
						// if (validator.canSubmit(this.state.messages)) {
						// }
						target.submit();
					});
				}}
			>
				<VerticalSpacer space=".5em">
					<div>
						<Label status={this.state.messages.name.status}>Name</Label>
						<Input
							name="name"
							className={this.state.messages.name.status === 'error' && 'invalid'}
							value={this.state.name}
							status={this.state.messages.name.status}
							onChange={e => {
								const name = e.target.value;
								this.setState(prevState => ({
									name,
									messages: {
										...prevState.messages,
										name: validator.validateAgainst(name, validationMessages.name)
									}
								}));
							}}
							validateOnBlur={null}
							validateOnChange={null}
						/>
						{this.state.messages.name.body &&
							<InputMessage status={this.state.messages.name.status}>
								{this.state.messages.name.body}
							</InputMessage>
						}
					</div>
					<LabeledInputWithValidation
						name="email"
						label="Email"
						value={this.state.email}
						message={this.state.messages.email}
						onChange={e => this.setState({ email: e.target.value })}
						validate={() => this.setValidationMessage('email', validationMessages.email)}
					/>
					<LabeledInputWithValidation
						name="emailConfirm"
						label="Confirm Email"
						value={this.state.emailConfirm}
						message={this.state.messages.emailConfirm}
						onChange={e => this.setState({ emailConfirm: e.target.value })}
						validate={() => this.setValidationMessage('emailConfirm', validationMessages.emailConfirm)}
					/>
					<ButtonPrimary type="submit">
						Submit
					</ButtonPrimary>
				</VerticalSpacer>
			</form>
		);
	}
}