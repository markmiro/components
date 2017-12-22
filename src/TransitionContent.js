import React from "react";
import { TransitionMotion, spring, presets } from "react-motion";

const requiredStyles = {
  right: 0,
  bottom: 0,
  left: 0,
  top: 0,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const config = {
  slow: {
    stiffness: 80,
    damping: 20
  },
  medium: {
    stiffness: 400,
    damping: 40
  },
  fast: {
    stiffness: 1000,
    damping: 35
  }
};

const TransitionContent = ({ children, speed = "medium" }) => {
  const child = React.Children.only(children);

  const springConfig = config[speed];

  return (
    <TransitionMotion
      styles={[
        {
          key: child.key,
          data: { element: child },
          style: {
            opacity: spring(
              (child.props.style && child.props.style.opacity) || 1
            ),
            top: spring(0, springConfig)
          }
        }
      ]}
      willEnter={() => ({
        opacity: 1,
        top: 100
      })}
      willLeave={() => ({
        opacity: spring(1, springConfig),
        top: spring(-100, springConfig)
      })}
    >
      {styles => (
        <span>
          {styles.map(({ key, style, data }) => (
            <data.element.type
              key={key}
              {...data.element.props}
              style={{
                ...data.element.props.style,
                ...style,
                ...requiredStyles,
                transform: `translateY(${style.top}%)`
              }}
            />
          ))}
        </span>
      )}
    </TransitionMotion>
  );
};

export default TransitionContent;
