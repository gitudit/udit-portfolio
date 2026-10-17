import React from "react";
import "./Contact.css";
import { illustration } from "../../portfolio";
import { Fade } from "../../components/reveal/Reveal";
import emailAnimation from "../../assets/lottie/email.json?url";
import contactMailDark from "../../assets/images/contactMailDark.svg";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import emailjs from "emailjs-com";
import validator from "email-validator";

// EmailJS identifiers come from .env (VITE_serviceId, VITE_templateId, VITE_userId).
const EMAILJS_SERVICE_ID = import.meta.env.VITE_serviceId;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_templateId;
const EMAILJS_USER_ID = import.meta.env.VITE_userId;

const Card = (props) => <div className="card">{props.children}</div>;

const Form = (props) => (
  <form className="form" onSubmit={props.onSubmit}>
    {props.children}
  </form>
);

const TextInput = (props) => (
  <div className="text-input">
    <label className={props.focus || props.value !== "" ? "label-focus" : ""} htmlFor={props.name}>
      {props.label}
    </label>
    <input
      className={props.focus || props.value !== "" ? "input-focus" : ""}
      type="text"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onInput={props.onInput}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    />
  </div>
);

const TextArea = (props) => (
  <div className="text-area">
    <label className={props.focus || props.value !== "" ? "label-focus" : ""} htmlFor={props.name}>
      {props.label}
    </label>
    <textarea
      className={props.focus || props.value !== "" ? "input-focus" : ""}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onInput={props.onInput}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    />
  </div>
);

const Button = (props) => {
  if (props.success === "true") {
    return (
      <button className="buttong" type="submit">
        Sent!
      </button>
    );
  } else if (props.success === "fail") {
    return (
      <button className="buttonf" type="submit">
        Invalid Email!
      </button>
    );
  }
  return (
    <button className="button" type="submit">
      {props.children}
    </button>
  );
};

const emptyFields = () => ({
  name: { name: "name", label: "Name", value: "", focus: false },
  email: { name: "email", label: "Email", value: "", focus: false },
  message: { name: "message", label: "Message", value: "", focus: false }
});

class Contact extends React.Component {
  constructor() {
    super();
    this.state = {
      ...emptyFields(),
      errors: { email: "" },
      success: ""
    };
  }

  componentWillUnmount() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  handleFocus(e) {
    const name = e.target.name;
    const state = Object.assign({}, this.state[name]);
    state.focus = true;
    this.setState({ [name]: state });
  }

  handleBlur(e) {
    const name = e.target.name;
    const state = Object.assign({}, this.state[name]);
    state.focus = false;
    this.setState({ [name]: state });
  }

  handleChange(e) {
    const name = e.target.name;
    const state = Object.assign({}, this.state[name]);
    state.value = e.target.value;
    this.setState({ [name]: state });
  }

  submitSuccess() {
    this.setState((state) => ({ ...state, success: "true" }));
    this.resetTimer = setTimeout(() => {
      this.setState((state) => ({ ...state, ...emptyFields(), errors: { email: "" }, success: "" }));
    }, 2000);
  }

  submitFail() {
    this.setState((state) => ({ ...state, success: "fail" }));
  }

  handleSubmit(e) {
    // Always stop the native submit. The original only did so for valid addresses, so an invalid
    // email reloaded the page with the form fields in the URL before "Invalid Email!" could be seen.
    e.preventDefault();
    if (validator.validate(this.state.email.value)) {
      const templateParams = {
        name: this.state.name.value,
        email: this.state.email.value,
        message: this.state.message.value
      };
      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
        .then(() => {
          this.submitSuccess();
        })
        .catch((err) => console.error(err));
    } else {
      this.submitFail();
    }
  }

  render() {
    const { name, email, message } = this.state;
    return (
      <Fade bottom duration={1000} distance="20px">
        <div className="main contact-margin-top" id="contact">
          <div className="contact-div-main">
            <Card>
              <h1 className="heading contact-title">Contact me</h1>

              <Form onSubmit={this.handleSubmit.bind(this)}>
                <TextInput
                  {...name}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)}
                />
                <TextInput
                  {...email}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)}
                />
                <TextArea
                  {...message}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)}
                />
                <Button success={this.state.success}>Send</Button>
              </Form>
            </Card>
            <div className="contact-image-div">
              {illustration.animated ? (
                <DisplayLottie animationPath={emailAnimation} />
              ) : (
                <img alt="Man working" src={contactMailDark}></img>
              )}
            </div>
          </div>
        </div>
      </Fade>
    );
  }
}

export default Contact;
