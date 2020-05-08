import ProHopLogo from "../../ProHop-ai.png"
import React, {Component} from "react";
import './Login.css'
import axios from 'axios'
import './SignUp.css'
import ApiCall from '../api'
export default class SignUp extends Component {

    api = new ApiCall();

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            displayName: '',
            confirmPassword: ''
        }
    }

    updateEmail(value) {
        this.setState({email: value})
    }

    updatePassword(value) {
        this.setState({password: value})
    }

    updateDisplayName(value) {
        this.setState({displayName: value})
    }

    confirmPassword(value) {
        this.setState({confirmPassword: value})
    }

    validatePassword() {
        if (!this.state.password || !this.state.confirmPassword) {
            return true;
        }
        return this.state.password === this.state.confirmPassword
    }

    render() {
        return (
            <div className={'page-container'}>
                <div className={'page-background'}>
                </div>
                <div className={'inner-container'}>
                    <div className={'logo-container'}>
                        <span className={'logo-wrapper'}>
                            <img src={ProHopLogo} alt="Logo" className="organization-logo"/>
                        </span>
                    </div>
                    <div className={'login-container'}>
                        <form onSubmit={ (event) => this.handelSubmit(event)}>
                            <div className={'header'}>
                                <div className={'container description'}>
                                    <h1>TeamGen</h1>
                                    <p>The team and tournament organizer.</p>
                                </div>
                            </div>

                            <div className={'login-group'}>
                        <div className={'container'}>
                            <div className={'row my-auto justify-content-center'}>
                                    <h3>Sign Up</h3>
                                </div>
                            <div className={'row my-auto justify-content-center'}>
                                <div className={'input-wrapper col-lg-8'}>
                                    <input type={'text'} className={'form-control'} placeholder={'organization'}
                                           value={this.state.displayName} onChange={(event) => {
                                        this.updateDisplayName(event.target.value)
                                    }}/>
                                </div>
                                <div className={'input-wrapper col-lg-8'}>
                                    <input type={'email'} className={'form-control'} placeholder={'email/phone number'}
                                           value={this.state.email} onChange={(event) => {
                                        this.updateEmail(event.target.value)
                                    }}/>
                                </div>

                                
                            </div>


                            <div className={'row my-auto justify-content-center'}>
                                <div className={'input-wrapper col-lg-8'}>
                                    <input type={'password'} className={'form-control'}
                                           placeholder={'password'}
                                           value={this.state.password} onChange={(event) => {
                                        this.updatePassword(event.target.value)
                                    }}/>
                                </div>
                                <div className={'input-wrapper col-lg-8'}>
                                    <input type={'password'} className={'form-control'}
                                           placeholder={'confirm password'}
                                           value={this.state.confirmPassword} onChange={(event) => {
                                        this.confirmPassword(event.target.value)
                                    }}/>


                                    {!this.validatePassword() &&
                                    <p className={'error text-right'}>The passwords do not match</p>}
                                </div>
                            </div>


                            <div className={'my-auto'}>
                                <div className={'submit-button-group col-lg-8 offset-lg-2'}>
                                    <button disabled={!this.validForm()} type={'submit'}
                                            className={'btn btn-primary btn-block'}>Sign Up
                                    </button>
                                    <p className={'forgot-password text-right help-links'}>
                                        Already have an account? <a href={'/sign-in'}>Log-in </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                            
                        </form>
                    </div>
                </div>
            </div>
            
        );
    }

    validForm() {
        return this.state.email.length && this.state.displayName && this.state.password && this.state.confirmPassword && this.validatePassword()
    }

    handelSubmit(event) {
        event.preventDefault();
        delete this.state.confirmPassword;
        const resp = this.api.post('/user',this.state);
        this.props.history.push('/');
    }
}
