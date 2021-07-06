import React, { useContext } from "react";
import "./Contact.css";
import { illustration, contactInfo } from "../../portfolio";
import { Fade } from "react-reveal";
import email_email from "../../assets/lottie/email";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import StyleContext from "../../contexts/StyleContext";
import emailjs from 'emailjs-com';
import validator from "email-validator";

require('dotenv').config();



const Card = props => (
  <div className="card">
    {/*<div className="waves">
    </div>*/}
    {props.children}
  </div>
);

const Form = props => (
  <form className="form" onSubmit={props.onSubmit} >{props.children}</form>
);

const TextInput = props => (
  <div
    className="text-input">
    <label
      className={(props.focus || props.value !== '') ? 'label-focus' : ''}
      htmlFor={props.name}>{props.label}</label>
    <input
      className={(props.focus || props.value !== '') ? 'input-focus' : ''}
      type="text"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onInput={props.onInput}
      onFocus={props.onFocus}
      onBlur={props.onBlur} />
  </div>
);

const TextArea = props => (
  <div
    className="text-area">
    <label
      className={(props.focus || props.value !== '') ? 'label-focus' : ''}
      htmlFor={props.name}>{props.label}</label>
    <textarea
      className={(props.focus || props.value !== '') ? 'input-focus' : ''}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onInput={props.onInput}
      onFocus={props.onFocus}
      onBlur={props.onBlur} />
  </div>
);

const Button = props => {
  if(props.success=='true')
  {
  return <button
    className="buttong" type="submit">Sent!</button>
}
else if(props.success=='fail')
{
  return <button
    className="buttonf" type="submit">Invalid Email!</button>
}
else
{
  return <button
    className="button" type="submit">{props.children}</button>
}
}
  


class Contact extends React.Component {
  constructor() {
    super();
    this.state = {
      name: {
        name: 'name',
        label: 'Name',
        value: '',
        focus: false,
      },
      email: {
        name: 'email',
        label: 'Email',
        value: '',
        focus: false,
      },
      message: {
        name: 'message',
        label: 'Message',
        value: '',
        focus: false,
      },
      errors:{
        email:''
      },
      success:''
    }
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

submitSuccess()
{
  this.setState(state=>({...state,success:'true'}));
  setTimeout(() => {
    this.setState(state=>({...state,name: {
      name: 'name',
      label: 'Name',
      value: '',
      focus: false,
    },
    email: {
      name: 'email',
      label: 'Email',
      value: '',
      focus: false,
    },
    message: {
      name: 'message',
      label: 'Message',
      value: '',
      focus: false,
    },
    errors:{
      email:''
    },
    success:''}));
  }, 2000);
  

}
submitFail()
{
  this.setState(state=>({...state,success:'fail'}));
}

handleSubmit(e)
{
  if(validator.validate(this.state.email.value))
  {
  e.preventDefault();
  const templateId=process.env.REACT_APP_templateId;
  const userId=process.env.REACT_APP_userId;
  const serviceId=process.env.REACT_APP_serviceId;
  const templateParams = {
      name: this.state.name.value,
      email: this.state.email.value,
      message: this.state.message.value
    };
    emailjs.send(serviceId,templateId,templateParams,userId).then((response)=>{
      this.submitSuccess();})
      .catch(err=>console.log(err));
    }
    else
    {
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

              <Form onSubmit={this.handleSubmit.bind(this)} >
                <TextInput
                  {...name}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)} />
                <TextInput
                  {...email}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)} />
                <TextArea
                  {...message}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)} />
                <Button success={this.state.success}>Send</Button>
              </Form>
            </Card>
          <div className="contact-image-div">
            {illustration.animated ? (
              <DisplayLottie animationData={email_email} />
            ) : (
              <img
                alt="Man working"
                src={require("../../assets/images/contactMailDark.svg")}
              ></img>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
}
}

export default Contact;


// export default function Contact() {
//   const { isDark } = useContext(StyleContext);
//   return (
//     <Fade bottom duration={1000} distance="20px">
//       <div className="main contact-margin-top" id="contact">
//         <div className="contact-div-main">
//           <div className="contact-header">
//             <h1 className="heading contact-title">{contactInfo.title}</h1>
//             <p
//               className={
//                 isDark
//                   ? "dark-mode contact-subtitle"
//                   : "subTitle contact-subtitle"
//               }
//             >
//               {contactInfo.subtitle}
//             </p>
//             <div
//               className={
//                 isDark ? "dark-mode contact-text-div" : "contact-text-div"
//               }
//             >
//               <a className="contact-detail" href={"tel:" + contactInfo.number}>
//                 {contactInfo.number}
//               </a>
//               <br />
//               <br />
//               <a
//                 className="contact-detail-email"
//                 href={"mailto:" + contactInfo.email_address}
//               >
//                 {contactInfo.email_address}
//               </a>
//               <br />
//               <br />
//               <SocialMedia />
//             </div>
//           </div>
//           <div className="contact-image-div">
//             {illustration.animated ? (
//               <DisplayLottie animationData={email} />
//             ) : (
//               <img
//                 alt="Man working"
//                 src={require("../../assets/images/contactMailDark.svg")}
//               ></img>
//             )}
//           </div>
//         </div>
//       </div>
//     </Fade>
//   );
// }
