import React from "react";
import {
  Motion,
  TransitionMotion,
  spring,
  presets,
  stripStyle
} from "react-motion";

const willEnter = () => ({
  height: 0
});

const willLeave = () => ({
  height: spring(0)
});

const TransitionContent = ({ children }) => (
  <TransitionMotion
    styles={
      !children
        ? []
        : React.Children.map(children, child => ({
            key: child.key,
            data: { element: child },
            style: {
              height: spring(child.props.style.height)
            }
          }))
    }
    willEnter={willEnter}
    willLeave={willLeave}
  >
    {styles => (
      <div>
        {styles.map(({ key, style, data }) => (
          <data.element.type
            key={key}
            {...data.element.props}
            style={{ ...data.element.props.style, ...style }}
          />
        ))}
      </div>
    )}
  </TransitionMotion>
);

class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: []
    };
  }

  render() {
    return (
      <TransitionContent>
        {this.state.people.map(person => (
          <div
            key={person.fName}
            style={{
              backgroundColor: person.color,
              color: "white",
              height: 100,
              overflow: "hidden"
            }}
          >
            {person.fName}
          </div>
        ))}
      </TransitionContent>
    );
  }

  componentDidMount() {
    // every 2 seconds, change the list of people
    this.interval = setInterval(() => {
      this.setState({
        people: this.props.people
          .map(n => (Math.random() > 0.5 ? n : null))
          .filter(n => n !== null)
      });
    }, 2500);
  }
}

const people = [
  { fName: "Betty", color: "red" },
  { fName: "Sue", color: "green" },
  { fName: "Aaron", color: "blue" },
  { fName: "Jamal", color: "black" },
  { fName: "Ann", color: "purple" }
];

const TransitionExample = () => <Picker people={people} />;

export default TransitionExample;
