import React from "react";
import Button from "../Button/Button";
import classes from "./FilesBar.module.scss";

export enum WhichKeys {
    All,
    Incomplete
}

interface Props {
    files: string[];
    addFile(url: string): void;
    removeLanguage(lang: string): void;
    onDownload(lang: string): void;
    which: WhichKeys;
    onChangeFilter(filter: WhichKeys): void;
}

export function FilesBar(props: Props) {
    const addFile = () => {
        const url = prompt("Paste the URL of the Raw GitHub file:");
        if (url) {
            props.addFile(url);
        }
    };

    function changeFilter(evt:any) {
        if (evt.target.checked) {
            props.onChangeFilter(evt.target.value === "all" ? WhichKeys.All : WhichKeys.Incomplete);
        }
    }

    return (
        <div className={classes.Row} data-testid="filesbar">
            <div className={classes.TranslationKeyFiller}>
                <input type="radio" name="whichkeys" 
                    value="all" checked={props.which === WhichKeys.All}
                    onChange={(evt) => changeFilter(evt)}
                    /> All
                <input type="radio" name="whichkeys" value="incomplete" checked={props.which === WhichKeys.Incomplete}
                    onChange={(evt) => changeFilter(evt)}
                    /> Incomplete
            </div>

            {props.files.map((lang, i) => {
                return (
                    <div className={classes.Language} key={i}>
                        {lang}
                        <Button text="X" onClick={() => props.removeLanguage(lang)} />
                        <Button text="download" onClick={() => props.onDownload(lang)} />
                    </div>
                );
            })}

            <div className={classes.Language}>
                <Button text="Add File"
                        onClick={() => addFile()}/>
            </div>
        </div>
    );
}
