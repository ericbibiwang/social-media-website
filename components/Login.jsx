import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import Navbar from './Navbar.jsx';
import PropTypes from 'prop-types';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: (this.props.user ? true : false)};
        this.click = this.click.bind(this);

        this.username = React.createRef();
        this.password = React.createRef();
        this.message = React.createRef();
    }

    async click() {
        const response = await fetch('http://localhost:8000/api/authenticate', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.username.current.value,
                password: this.password.current.value
            })
        });

        const data = response.json();
        
        if (!data.success)
            this.message.current.innerHTML = `<span style='color: red'>${data.message}</span>`;
        else {
            this.message.current.innerHTML = `<span style='color: green'>${data.message}</span>`;

            localStorage.setItem('token', data.token);
            this.props.toggleLogin(data.user);
            this.setState({loggedIn: true});
        }
    }

    render() {
        if (this.state.loggedIn)
            return (
                <Redirect to="/" />
            );
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : 'http://localhost:8000/account_circle.png'} />
                <div className="row center" style={{position: 'absolute', top: '90px', width: '25%'}}>
                    <div ref={this.message}></div>
                </div>
                <div className="row center" style={{position: 'absolute', top: '120px', width: '25%'}}>
                    <form>
                        <div className="row">
                            <div className="col-4">
                                <input ref={this.username} type="text" placeholder="Username" className="validate" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <input ref={this.password} type="password" placeholder="Password" className="validate" />
                            </div>
                        </div>
                        <div className="row">
                            <button className="col-4" onClick={this.click}>Log in</button>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                Don&rsquo;t have an account?
                                <Link to="/register">
                                    {' Sign up in seconds.'}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default Login;