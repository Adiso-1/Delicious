import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = ({ history }) => {
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (localStorage.getItem('authToken')) {
			history.push(path);
		}
	}, [history]);

	const loginHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(`${path}/login`, { email, password });
			localStorage.setItem('authToken', data.token);
			history.push(path);
		} catch (error) {
			setTimeout(() => {
				setError('');
			}, 2000);
			setError(`Couldn't log in`);
		}
	};
	return (
		<div className="login-screen">
			<form onSubmit={loginHandler} className="login-screen__form">
				<h3 className="login-screen__title">Login</h3>
				{error && <span className="error-message">{error}</span>}
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						required
						id="email"
						placeholder="Email address"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						tabIndex={1}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">
						Password:{' '}
						<Link to="/forgotpassword" className="login-screen__forgotpassword">
							Forgot Password?
						</Link>
					</label>
					<input
						type="password"
						required
						id="password"
						autoComplete="true"
						placeholder="Enter password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						tabIndex={2}
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Login
				</button>

				<span className="login-screen__subtext">
					Don't have an account? <Link to="/register">Register</Link>
				</span>
			</form>
		</div>
	);
};
export default LoginScreen;