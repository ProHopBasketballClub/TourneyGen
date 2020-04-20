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
                <form onSubmit={ (event) => this.handelSubmit(event)} >
                    <div className={'header'}>
                        <div className={'container'}>
                            <div className={'row my-auto justify-content-center'}>
                                <h1>TourneyGen</h1>
                            </div>
                        </div>
                    </div>

                    <div className={'login-group'}>
                        <div className={'container'}>
                            <div className={'row my-auto justify-content-center'}>
                                <div className={'input-wrapper col-lg-4 col-sm-12'}>
                                    <label>Email</label>
                                    <input type={'email'} className={'form-control'} placeholder={'Enter an email'}
                                           value={this.state.email} onChange={(event) => {
                                        this.updateEmail(event.target.value)
                                    }}/>
                                </div>

                                <div className={'input-wrapper col-lg-4 col-sm-12'}>
                                    <label>Display Name</label>
                                    <input type={'text'} className={'form-control'} placeholder={'Enter a display name'}
                                           value={this.state.displayName} onChange={(event) => {
                                        this.updateDisplayName(event.target.value)
                                    }}/>
                                </div>
                            </div>


                            <div className={'row my-auto justify-content-center'}>
                                <div className={'input-wrapper col-lg-4 col-sm-12'}>
                                    <label>Password</label>
                                    <input type={'password'} className={'form-control'}
                                           placeholder={'Create a password'}
                                           value={this.state.password} onChange={(event) => {
                                        this.updatePassword(event.target.value)
                                    }}/>
                                </div>
                                <div className={'input-wrapper col-lg-4 col-sm-12'}>

                                    <label>Confirm Password</label>
                                    <input type={'password'} className={'form-control'}
                                           placeholder={'Confirm password'}
                                           value={this.state.confirmPassword} onChange={(event) => {
                                        this.confirmPassword(event.target.value)
                                    }}/>


                                    {!this.validatePassword() &&
                                    <p className={'error text-right'}>The passwords do not match</p>}
                                </div>
                            </div>


                            <div className={'row'}>
                                <div className={'submit-button-group col-lg-2 offset-lg-8'}>
                                    <button disabled={!this.validForm()} type={'submit'}
                                            className={'btn btn-primary btn-block'}>Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
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
