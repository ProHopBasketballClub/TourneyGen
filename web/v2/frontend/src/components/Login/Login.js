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
                                    <label>Password</label>
                                    <input type={'password'} className={'form-control'} placeholder={'Enter password'}
                                           value={this.state.password} onChange={(event) => {
                                        this.updatePassword(event.target.value)
                                    }}/>
                                </div>
                            </div>

                            <div className={'row'}>
                                <div className={'submit-button-group col-lg-2 offset-lg-8'}>
                                    <button disabled={!this.validForm()} type={'submit'}
                                            className={'btn btn-primary btn-block'}>Submit
                                    </button>
                                    <p className={'forgot-password text-right'}>
                                        Forgot <a href={'#'}>password? </a> <br/>
                                        New user <a href={'/sign-up'}>sign-up </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
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
