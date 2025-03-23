import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import useAuth from "../hooks/userAuth";

const Login = (props) => {
	const [enteredEmail, setEnteredEmail] = useState("");
	const [emailIsValid, setEmailIsValid] = useState();
	const [enteredPassword, setEnteredPassword] = useState("");
	const [passwordIsValid, setPasswordIsValid] = useState();
	const [formIsValid, setFormIsValid] = useState(false);
	const { login, isAuthenticated, error } = useAuth();
	const history = useNavigate();

	const emailChangeHandler = (event) => {
		setEnteredEmail(event.target.value);

		setFormIsValid(
			event.target.value.includes("@") && enteredPassword.trim().length > 6
		);
	};

	const passwordChangeHandler = (event) => {
		setEnteredPassword(event.target.value);

		setFormIsValid(
			event.target.value.trim().length > 6 && enteredEmail.includes("@")
		);
	};

	const validateEmailHandler = () => {
		setEmailIsValid(enteredEmail.includes("@"));
	};

	const validatePasswordHandler = () => {
		setPasswordIsValid(enteredPassword.trim().length > 6);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		props.onLogin(enteredEmail, enteredPassword);

		await login(enteredEmail, enteredPassword);
		if (isAuthenticated) {
			// Redirect to the search page after successful login
			history.push("/search");
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${
						emailIsValid === false ? classes.invalid : ""
					}`}
				>
					<input
						type="email"
						id="email"
						value={enteredEmail}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
						placeholder="Email"
					/>
				</div>
				<div
					className={`${classes.control} ${
						passwordIsValid === false ? classes.invalid : ""
					}`}
				>
					<Input
						type="password"
						id="password"
						value={enteredPassword}
						placeholder="Password"
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
			{error && <p>{error}</p>}
		</Card>
	);
};

export default Login;
