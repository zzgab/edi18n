import React, { useState } from "react";
import classes from "./Entry.module.scss";
import classNames from "classnames";
import Button from "../Button/Button";

interface Props {
    tkey: string;
    langs: {[lang: string]: string};
    first: boolean;
    onChange(english: string, french: string): void;
    onRemove(key: string): void;
}

function Entry(props: Props) {

    const [focus, setFocus] = useState(false);

    const isIncomplete = (lang: string) => !props.langs[lang];
    const isIncompleteLine = () => {
        for (let code in props.langs) {
            if (! props.langs[code]) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className={classNames(classes.Row, {[classes.Focused]: focus, [classes.Incomplete]: isIncompleteLine()})}>

            <div className={classes.TranslationKey}>
                <Button text="X" onClick={() => props.onRemove(props.tkey)} />
                {props.tkey}
            </div>

            {Object.keys(props.langs).map(code => (
                <textarea 
                    id={`textarea_${code}_${props.tkey}`}
                    key={code}
                    className={classNames(classes.Textarea, {[classes.NotFirst]: !props.first}, {[classes.Incomplete]: isIncomplete(code)})}
                    onChange={evt => props.onChange(code, evt.target.value)}
                    value={props.langs[code]}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                ></textarea>
            ))}

        </div>
    );
}

export default Entry;
