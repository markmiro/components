import { isEqual, forIn } from 'lodash';

// * Link errors with messages
// * Show message at one of these times
//   - After clicking submit
//   - After blurring
//   - While typing
// * Allow sharing validation between frontend and backend
// * Allow multiple validations to be applied easily
// * ALlow async validation
// * Validate for success if current field is error but user is typing
// * Have good default behavior

// TODO: make it validate all when submitting
// TODO: make error validators composable
// TODO: allow error

const MAX_TWEET_LENGTH = 25;

const isValid = {
	// true if not empty
	exists: text => !/^\s*$/.test(text),
	// true if valid email
	email: email => /\S+@\S+\.\S+/.test(email),
	// true if email is unique
	emailUnique: email => isUniqueCb => window.setTimeout(() =>
		isUniqueCb(
			!!Math.round(Math.random())
		)
	, 500),
	// true if tweet length is ok
	tweetLength: tweet => tweet.length <= MAX_TWEET_LENGTH,
};
isValid.tweetLength.MAX_TWEET_LENGTH = MAX_TWEET_LENGTH;

const messageTemplate = {
	error: str => ({body: str, status: 'error'}),
	// warning: str => ({message: str, status: 'warning'}),
	info: str => ({body: str, status: ''}),
	NONE: {body: '', status: ''},
}

const validateAgainst = (input, validators) => {
	console.log('validate input', input, 'against validators', validators);
	for (let validator of validators) {
		const message = validator(input);
		console.log('message', message);
		if (!isEqual(message, messageTemplate.NONE)) {
			console.log('return message');
			return message;
		}
	}
	return messageTemplate.NONE;
};

const validateAgainstMultiple = (inputObj /*state*/, validatorObj /*validationMessages*/) => {
	const returnObj = {};
	forIn(validatorObj, (validators, k) => {
		const message = validateAgainst(inputObj[k], validators)
		returnObj[k] = (message.status === ''
			? messageTemplate.info()
			: message
		);
	});
	return returnObj;
}

const canSubmit = messages => !Object.values(messages).some(message => message.status === 'error');

export default {
	messageTemplate,
	validateAgainst,
	validateAgainstMultiple,
	isValid,
	canSubmit,
};
