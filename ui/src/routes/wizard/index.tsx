import { useState } from 'react';
import { FileRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
import logo from '/logo-full.svg';
import './wizard.css';

export const Route = new FileRoute('/wizard/').createRoute({
    loader: async ({ context: { queryClient }}) => {
        const headerQuery = queryClient.ensureQueryData(headerQueryOptions());
        const languagesQuery = queryClient.ensureQueryData(languagesQueryOptions());
        const translationQuery = queryClient.ensureQueryData(translationQueryOptions());
        const [header, languages, T] = await Promise.all([headerQuery, languagesQuery, translationQuery]);
        return {header, languages, T};
    },
    component: Wizard,
})

const headerQueryOptions = () => queryOptions({
    queryKey: ["header"],
    queryFn: fetchHeader,
})

const languagesQueryOptions = () => queryOptions({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
})

const translationQueryOptions = () => queryOptions({
    queryKey: ["translation"],
    queryFn: fetchTranslation
})

const fetchHeader: () => Promise<{ [key: string]: string }> = async () => await fetch('/header').then(res => res.json())
const fetchLanguages: () => Promise<string[][]> = async () => await fetch('/languages').then(res => res.json())
const fetchTranslation: () => Promise<{ [key: string]: string }> = async () => await fetch('/localization').then(res => res.json())

function Wizard() {
    const {header, languages, T} = Route.useLoaderData();
    const [selectedLanguage, setSelectedLanguage] = useState(header['active_lang']);

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
