import React from "react";

import classes from "./Input.module.css";

const Input = (props) => {
	return (
		<input
			type={props.type || "text"}
			value={props.value}
			onChange={props.onChange}
			placeholder={props.placeholder}
			className={`${classes.input} ${props.className}`}
			onClick={props.onClick}
		/>
	);
};

export default Input;
