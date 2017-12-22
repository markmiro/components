import React, { Component } from 'react';

const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowers = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const keyboardChars = '!@#$%^&*()_+-=[]{}\|;\':",./<>?';
const commonHiddenKeyboardChars = '¡™£¢•º–“‘…æ`⁄€°·‚—”’Æ¿œ®øåß∂ƒ©∆';
// const hiddenKeyboardChars = '¡™£¢∞§¶•ªº–≠“‘…æ≤≥«`⁄€‹›ﬁﬂ‡°·‚—±”’»ÚÆ¯˘¿œ∑´®øåß∂ƒ©∆ç˜µ';
const supportedChars = capitals + lowers + numbers + keyboardChars + commonHiddenKeyboardChars;

const supportedCharsArr = supportedChars.split('');

export default class CharacterWidthCalculator extends Component {
	constructor(props) {
		super(props);
		this.charElements = [];
		this.state = {
			map: {}
		};
	}

	componentDidMount() {
		const map = {};
		this.charElements.map((el, i) => {
			const char = supportedCharsArr[i];
			map[char] = el.getBoundingClientRect().width;
		});
		this.setState({ map });
	}

	render() {
		return (
			<div>
				<div style={{width: '100%'}}>
					{supportedCharsArr.map((char, i) =>
						<span key={i} ref={el => {
							this.charElements[i] = el;
						}}>
							{char}
						</span>
					)}
				</div>
				<pre>
					{JSON.stringify(this.state.map, null, '  ')}
				</pre>
			</div>
		);
	}
}