import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import { shuffle } from 'lodash';
import TransitionContent from './TransitionContent';

class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: this.props.people[0]
    };
  }

  componentDidMount() {
    // every 2 seconds, change the list of people
    this.interval = setInterval(() => {
      this.setState({
        person: shuffle(this.props.people)[0]
      })
    }, 2000)
  }

  render() {
    return (
        <TransitionContent speed="slow">
      	   <div key={this.state.person.fName} style={{
              backgroundColor: this.state.person.color,
              color: 'white',
              position: 'absolute',
              width: '100%',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '40px',
            }}>
              {this.state.person.fName}
            </div>
        </TransitionContent>
    )
  }
}

const people = [
  {fName: 'Betty', color: 'red'},
  {fName: 'Sue', color: 'green'},
  {fName: 'Aaron', color: 'blue'},
  {fName: 'Jamal', color: 'black'},
  {fName: 'Ann', color: 'purple'}
];

const TransitionContentExample = () => (
	<Picker people={people} />
);

export default TransitionContentExample;