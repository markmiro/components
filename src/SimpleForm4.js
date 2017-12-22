import React, { Component } from 'react';
import { isEqual, noop } from 'lodash';
import {
  Input,
  Label,
  Select,
  ButtonPrimary,
  InputMessage,
  VerticalSpacer,
} from './FormComponents';
import validations from './validations';
import Validated from './Validated';
import ValidatedInput from './ValidatedInput';
import { mapValues } from 'lodash';

const addUser = ({ fName, email, confirmEmail }) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			(email === 'john@example.com'
				? reject({ email: 'This email is already registered' })
				: resolve()
			)
		}, 700);
	});
};

class SimpleForm extends React.Component {
	state = {
		isSubmitting: false
	}
	render = () => (
		<Validated
			validations={(state) => ({
				fName: validations.fName,
				email: validations.email,
				confirmEmail: (confirm) => validations.confirmEmail(state.email, confirm),
			})}
			initialValues={{
				fName: 'John',
				email: 'john@example.com',
				confirmEmail: 'john@example.com',
			}}
			render={({ fName, email, confirmEmail, validateAll, allValid, setValidationMessages }) => (
				<form onSubmit={e => {
					e.preventDefault();
					validateAll();
					this.setState({ isSubmitting: true });
					addUser({ fName: fName.value, email: email.value, confirmEmail: confirmEmail.value })
						.then(() => alert('Success'))
						.catch(validationMessages => setValidationMessages(validationMessages))
						.then(() => this.setState({ isSubmitting: false }))
				}}>
					<VerticalSpacer space=".5em">
						<ValidatedInput
							label="First name"
							{...fName.getProps()}
							errorMessage={fName.validationMessage}
						/>
						<ValidatedInput
							label="Email"
							{...email.getProps({
								onChange: e => confirmEmail.validateIfNonEmpty(e)
							})}
							errorMessage={email.validationMessage}
						/>
						<ValidatedInput
							label="Confirm email"
							{...confirmEmail.getProps()}
							errorMessage={confirmEmail.validationMessage}
						/>
						<ButtonPrimary type="submit" disabled={!allValid() || this.state.isSubmitting}>
							{this.state.isSubmitting ? 'Submitting...' : 'Submit'}
						</ButtonPrimary>
					</VerticalSpacer>
				</form>
		)} />
	)
}

export default SimpleForm;