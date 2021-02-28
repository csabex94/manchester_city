import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import FormField from '../../ui/formFields';
import { validate } from '../../ui/misc';

import { firebasePromotions } from '../../../firebase';

class Enroll extends Component {

    state = {

        formError: false,
        formSuccess: '',
        formData: {
            email: {
                element: 'input',
                value: '',
                config: {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                validationMessage: ''
            }
        }

    }


    updateForm(element) {
        
        const newFormdata = {...this.state.formData}
        const newElement = {...newFormdata[element.id]}

        newElement.value = element.event.target.value;

        let valiData = validate(newElement);

        newElement.valid = valiData[0];
        newElement.validationMessage = valiData[1];

        newFormdata[element.id] = newElement;

        this.setState({
            formError: false,
            formData: newFormdata
        })

    }


    resetFormSuccess(type) {

        const newFormdata = {...this.state.formData}

        for (let key in newFormdata) {
            newFormdata[key].value = '';
            newFormdata[key].valid = false;
            newFormdata[key].validationMessage = '';
        }

        this.setState({
            formError: false,
            formData: newFormdata,
            formSuccess: type ? 'Congratulations!' : 'Already on the database.'
        });

        this.successMessageClear();

    }

    successMessageClear() {
        setTimeout(() => {
            this.setState({
                formSuccess: ''
            })
        }, 2000)
    }


    submitForm(event) {

        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for (let key in this.state.formData) {
            dataToSubmit[key] = this.state.formData[key].value;
            formIsValid = this.state.formData[key].valid && formIsValid;
        }

        if (formIsValid) {
            
            firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once("value").then((snapshot) => {
                if (snapshot.val() === null) {
                    firebasePromotions.push(dataToSubmit);
                    this.resetFormSuccess(true);
                } else {
                    this.resetFormSuccess(false);
                }
            })

        } else {
            this.setState({
                formError: true
            })
        }

    }


    render() {
        return (
            <Fade>
                <div className="enroll_wrapper">
                    <form onSubmit={(event) => this.submitForm(event)}>
                        <div className="enroll_title">
                            Enter your email
                        </div>

                        <div className="enroll_input">

                            <FormField
                                id={'email'}
                                formData={this.state.formData.email}
                                change={(element) => this.updateForm(element)}
                            />

                            {this.state.formError ? <div className="error_label">Something is wrong. Try again!</div> : null}

                            <div className="success_label">{this.state.formSuccess}</div>

                            <button onClick={(event) => this.submitForm(event)}>Enroll</button>

                            <div className="enroll_discl">
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. 
                            </div>
                            
                        </div>
                    </form>
                </div>
            </Fade>
        );
    }
}

export default Enroll;