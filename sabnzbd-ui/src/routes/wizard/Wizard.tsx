import { useEffect, useState } from 'react';
import logo from '/logo-full.svg';
import './Wizard.css';

export default function Wizard() {
    const [T, setT] = useState(Object);
    const [header, setHeader] = useState(Object);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        Promise.all([
            fetch('/header')
                .then(res => res.json())
                .then(data => {
                    setHeader(data);
                    setSelectedLanguage(data['active_lang'])
                }),
            fetch('/languages')
                .then(res => res.json())
                .then(data => setLanguages(data)),
            fetch('/localization')
                .then(res => res.json())
                .then(data => setT(data)),
        ]);
    }, []);

    const noLanguages = (
        <>
            <hr />
            No language files detected. Please run <code>python tools/make_mo.py</code> once and restart SABnzbd, or contact your package provider.                    
        </>
    );

    return (
        <>
            <div id="logo">
                <img src={logo} alt="SABnzbd" />
            </div>
            <form action="/wizard/one" method="post">
                <div className="container">
                    <div id="inner">
                        <div id="content" className="bigger">
                            <div id="rightGreyText">{T['wizard-version']} {header['version']}</div>
                            <h1>{T['wizard-quickstart']}</h1>
                            <hr />
                            <div className="bigger">
                                <h3>{T['opt-language']}</h3>
                                {T['explain-language']}
                                <br />
                                <br />
                                <div className="main-container">
                                    {languages.length ? languages.map(LanguageOption) : noLanguages}
                                    <div className="spacer"></div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-4 text-center">
                                <a className="btn btn-danger" href={`../shutdown/?apikey=${header['apikey']}&amp;pid=${header['pid']}`}><span className="glyphicon glyphicon-remove"></span> {T['wizard-exit']}</a>
                            </div>
                            <div className="col-md-4 text-center">
                                <a className="btn btn-default" href="../config/general/#config_backup_file"><span className="glyphicon glyphicon-open"></span> {T['restore-backup']}</a>
                            </div>
                            <div className="col-md-4 text-center">
                                <button className="btn btn-default">{T['wizard-start']} <span className="glyphicon glyphicon-chevron-right"></span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
    
    function LanguageOption(language: string[]): JSX.Element {
        const code = language[0];
        const name = language[1];

        return (
            <label key={code} className="language">
                {name}
                <br />
                <input 
                    type="radio" 
                    name="lang"
                    id={code} 
                    value={code} 
                    checked={code === selectedLanguage}
                    onChange={handleLanguageSelection}/>
            </label>
        )
    }

    function handleLanguageSelection(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedLanguage(e.target.value);
    }
}
