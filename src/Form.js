import React, { Component } from "react";
import styled from "styled-components";
import { isEqual, omit } from "lodash";
import {
    Input,
    Label,
    Select,
    Button,
    ButtonPrimary,
    InputMessage,
    VerticalSpacer,
    FinePrint,
    Loading
} from "./FormComponents";
import TransitionContent from "./TransitionContent";

const AdvancedInput = props => {
    const {
        label,
        name,
        message,
        errorMessage,
        warningMessage,
        successMessage,
        ...rest
    } = props;
    const status =
        (errorMessage && "error") ||
        (warningMessage && "warning") ||
        (successMessage && "success") ||
        "";
    const finalMessage =
        errorMessage || warningMessage || successMessage || message;
    return (
        <div>
            {label && (
                <Label htmlFor={name} status={status}>
                    {label}
                </Label>
            )}
            <Input name={name} status={status} {...rest} />
            {finalMessage && (
                <InputMessage status={status}>{finalMessage}</InputMessage>
            )}
        </div>
    );
};

const NO_ERRORS = {
    name: "",
    password: "",
    email: ""
};

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            email: "",
            isSubmitting: false,
            errors: NO_ERRORS,
            successes: {}
        };
        // Validation can happen:
        // * while typing
        // * on blur
        // * on submit
        //
        // We want to support all
    }

    encourage() {
        this.setState({
            successes: {
                name: `You've typed ${this.state.name.length} chars, keep going`
            }
        });
    }

    render() {
        const {
            name,
            password,
            email,
            errors,
            successes,
            isSubmitting
        } = this.state;
        return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const requiredMessage = "This field is required";
                    this.setState({ isSubmitting: true });
                    window.setTimeout(
                        () =>
                            this.setState({
                                isSubmitting: false,
                                errors: {
                                    name: name.length === 0 && requiredMessage,
                                    email:
                                        (email.length === 0 &&
                                            requiredMessage) ||
                                        (!email.includes("@") &&
                                            "Please enter a valid email"),
                                    password:
                                        (password.length === 0 &&
                                            requiredMessage) ||
                                        (password.length < 10 &&
                                            "Password too short")
                                }
                            }),
                        300
                    );
                }}
            >
                <VerticalSpacer space="1rem">
                    <h1>Register</h1>
                    <div style={{ marginTop: "2rem" }}>
                        <AdvancedInput
                            name="name"
                            label="Name"
                            value={name}
                            onChange={e =>
                                this.setState(
                                    { name: e.target.value },
                                    this.encourage
                                )
                            }
                            onBlur={() =>
                                this.setState({ successes: { name: "" } })
                            }
                            message={successes.name}
                            errorMessage={errors.name}
                        />
                    </div>
                    <div>
                        <AdvancedInput
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={e =>
                                this.setState({ email: e.target.value })
                            }
                            errorMessage={errors.email}
                        />
                    </div>
                    <div>
                        <AdvancedInput
                            name="password"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={e =>
                                this.setState({ password: e.target.value })
                            }
                            errorMessage={errors.password}
                        />
                    </div>

                    <ButtonPrimary
                        type="submit"
                        disabled={isSubmitting}
                        isSubmitting={isSubmitting}
                        style={{
                            marginTop: "2.25rem",
                            position: "relative",
                            height: 47
                        }}
                    >
                        <TransitionContent speed="fast">
                            {isSubmitting ? (
                                <Loading key={1} />
                            ) : (
                                <span key={2}>Create Account</span>
                            )}
                        </TransitionContent>
                    </ButtonPrimary>
                    <hr />
                    <VerticalSpacer space=".5rem">
                        <Button>Continue with Facebook</Button>
                        <Button>Continue with Google</Button>
                    </VerticalSpacer>
                    <FinePrint style={{ textAlign: "center" }}>
                        By clicking Create Account, Continue with Facebook, or
                        Continue with Google, you agree to our
                        <br />
                        <a href="/terms">Terms and Conditions</a>.
                    </FinePrint>
                </VerticalSpacer>
            </form>
        );
    }
}

export default Form;
