import React from "react";

interface Props {
    text: string;
    onClick(): void;
}

function Button(props: Props) {
    return (
        <button onClick={props.onClick}>{props.text}</button>
    );
}

export default Button;
