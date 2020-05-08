import ProHopLogo from "../../ProHop-ai.png"
import React, {Component} from "react";
import './Login.css'


export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    updateEmail(value) {
        this.setState({email: value})
    }

    updatePassword(value) {
        this.setState({password: value})
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
                                <div className={'container description'}>
                                    <div className={'row my-auto justify-content-center'}>
                                        <h3>Login</h3>
                                    </div>

                                    <div className={'my-auto'}>
                                        <div className={'input-wrapper col-lg-8'}>
                                            <input type={'email'} className={'form-control'} placeholder={'email/phone number'}
                                                value={this.state.email} onChange={(event) => {
                                                this.updateEmail(event.target.value)
                                            }}/>
                                        </div>

                                        <div className={'input-wrapper col-lg-8'}>
                                            <input type={'password'} className={'form-control'} placeholder={'password'}
                                                value={this.state.password} onChange={(event) => {
                                                this.updatePassword(event.target.value)
                                            }}/>
                                        </div>
                                    </div>

                                    <div className={'my-auto'}>
                                        <div className={'submit-button-group col-lg-8 offset-lg-2'}>
                                            <div className={'submit-btn'}>
                                                <button disabled={!this.validForm()} type={'submit'}
                                                        className={'btn btn-primary btn-block'}>Submit
                                                </button>
                                            </div>
                                            <p className={'forgot-password text-right help-links'}>
                                                Forgot your <a href={'#'}>password? </a> <br/>
                                                Don't have an account? <a href={'/sign-up'}>Sign-up </a>
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
        return this.state.email.length && this.state.password
    }

    handelSubmit(event) {
        event.preventDefault();
        this.props.history.push('/');
    }
}
