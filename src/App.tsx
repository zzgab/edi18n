import React, { useEffect, useState } from 'react';
import './App.css';
import Entry from './components/Entry/Entry';
import { WhichKeys, FilesBar } from './components/FilesBar/FilesBar';
import { fetchFile, LangFile } from './utils/fetchLangs';
import { saveAs } from 'file-saver';

function getLanguagesFromStorage(): {[lang: string]: boolean} {
  const persistedLangsStr: string = localStorage.getItem("files") || '{}';
  const languageSet: {[lang: string]: boolean} = JSON.parse(persistedLangsStr);
  return languageSet;
}

const restoreUrllist = (): string[] => {
  return Object.keys(getLanguagesFromStorage());
};

const loadFile = async (url: string) => {
  const dict = await fetchFile(url);
  return new LangFile(url, dict);
};

function App() {

  const [files, setFiles] = useState({} as {[code: string]: LangFile});
  const [whichKeys, setWhichKeys] = useState(WhichKeys.All);

  function isIncomplete(key: string) {
    for (let lang of Object.keys(files)) {
      const textarea = document.getElementById(`textarea_${lang}_${key}`);
      if (document.activeElement === textarea) {
        return true;
      }
      if (! files[lang].dict[key]) {
          return true;
      }
    }
    return false;
  }

  const mergeKeys = () => {
    const dicts = Object.keys(files).map(lang => files[lang].dict);

    return Object.keys(
      Object.assign({}, ...dicts)
    ).filter(key => whichKeys === WhichKeys.All || isIncomplete(key))
     .sort();
  };

  function downloadLanguage(lang: string): void {
    const blob = new Blob([JSON.stringify(files[lang].dict, null, 2)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${lang}.json`);
  }

  useEffect(() => {
    // https://stackoverflow.com/questions/18126559/how-can-i-download-a-single-raw-file-from-a-private-github-repo-using-the-comman
    // https://gist.github.com/madrobby/9476733
    (async function () {
      const loadedFiles = {} as {[code: string]: LangFile};
      for (let url of restoreUrllist()) {
        const langFile = await loadFile(url);
        loadedFiles[langFile.lang] = langFile;
      }

      setFiles(loadedFiles);
    }) ();
  }, []);

  const changeValue = (key: string, lang: string, val: string) => {
    const newFiles = Object.assign({}, files);
    newFiles[lang].dict[key] = val;
    setFiles(newFiles);
  }

  function removeKey(key: string) {
    const newFiles = Object.assign({}, files);
    for (let lang in newFiles) {
      delete newFiles[lang].dict[key];
    }
    setFiles(newFiles);
  }

  const addFile = async (url: string) => {
    const newSet = getLanguagesFromStorage();
    newSet[url] = true;
    persist(newSet);

    const langFile = await loadFile(url);
    setFiles({...files, [langFile.lang]: langFile});
  };

  function persist(langs: {[lang: string]: boolean}) {
    localStorage.setItem("files", JSON.stringify(langs));
  }

  const removeLanguage = (lang: string) => {
    const url = files && files[lang] && files[lang].url;
    if (!url) {
      return;
    }

    const storedLangs = getLanguagesFromStorage();
    delete storedLangs[url];
    persist(storedLangs);
    const newFiles = Object.assign({}, files);
    delete newFiles[lang];
    setFiles(newFiles);
  };

  function onChangeFilter(filter: WhichKeys) {
    setWhichKeys(filter);
  }

  return (
    <div className="App">
      <FilesBar 
        files={Object.keys(files)} 
        addFile={url => addFile(url)}
        removeLanguage={lang => removeLanguage(lang)}
        onDownload={lang => downloadLanguage(lang)}
        which={whichKeys}
        onChangeFilter={filter => onChangeFilter(filter)}
        />
      {mergeKeys().map((key: string, i: number) => (
        <Entry key={key} 
               tkey={key} 
               langs={Object.assign({}, ...Object.keys(files).map(lang => ({[lang]: files[lang].dict[key]})))}
               first={i === 0}
               onChange={(lang, val) => changeValue(key, lang, val)}
               onRemove={k => removeKey(k)}
        />
      ))}
    </div>
  );
}

export default App;
