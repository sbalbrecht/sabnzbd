import { FileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Trans } from "@lingui/macro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  headerQueryOptions,
  languageQueryOptions,
  languagesQueryOptions,
} from "../../api/common";
import "./wizard.css";
import { activateLanguage } from "../../i18n";

export const Route = new FileRoute("/wizard/").createRoute({
  loader: async ({ context: { queryClient } }) => {
    const headerQuery = queryClient.ensureQueryData(headerQueryOptions());
    const languagesQuery = queryClient.ensureQueryData(languagesQueryOptions());
    const [header, languages] = await Promise.all([
      headerQuery,
      languagesQuery,
    ]);
    return { header, languages };
  },
  component: WizardLanguageSelector,
});

const FormSchema = z.object({
  lang: z.string(),
});

type LanguageSelection = z.infer<typeof FormSchema>;

function WizardLanguageSelector() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/wizard" });
  const { header, languages } = Route.useLoaderData();

  const activeLang = header["active_lang"];

  const { register, handleSubmit } = useForm<LanguageSelection>({
    defaultValues: { lang: activeLang },
    values: { lang: activeLang },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (form: LanguageSelection) => {
    if (form.lang === activeLang) {
      // Don't bother updating and reactivating the current language
      navigate({ to: "/wizard/one" });
    } else {
      queryClient.fetchQuery(languageQueryOptions(form)).then(() => {
        activateLanguage(form.lang);
        navigate({ to: "/wizard/one" });
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div id="inner">
            <div id="content" className="bigger">
              <div id="rightGreyText">
                <Trans>SABnzbd Version</Trans> {header["version"]}
              </div>
              <h1>
                <Trans>SABnzbd Quick-Start Wizard</Trans>
              </h1>
              <hr />
              <div className="bigger">
                <h3>
                  <Trans>Language</Trans>
                </h3>
                <Trans>Select a web interface language.</Trans>
                <br />
                <br />
                <div className="main-container">
                  {languages.length ? (
                    languages.map(LanguageOption)
                  ) : (
                    <>
                      <hr />
                      No language files detected. Please run{" "}
                      <code>python tools/make_mo.py</code> once and restart
                      SABnzbd, or contact your package provider.
                    </>
                  )}
                  <div className="spacer"></div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-4 text-center">
                <a
                  className="btn btn-danger"
                  href={`../shutdown/?apikey=${header["apikey"]}&amp;pid=${header["pid"]}`}
                >
                  <span className="glyphicon glyphicon-remove"></span>{" "}
                  <Trans>Exit SABnzbd</Trans>
                </a>
              </div>
              <div className="col-md-4 text-center">
                <a
                  className="btn btn-default"
                  href="../config/general/#config_backup_file"
                >
                  <span className="glyphicon glyphicon-open"></span>{" "}
                  <Trans>Restore backup</Trans>
                </a>
              </div>
              <div className="col-md-4 text-center">
                <button className="btn btn-default">
                  <Trans>Start Wizard</Trans>{" "}
                  <span className="glyphicon glyphicon-chevron-right"></span>
                </button>
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
        <input type="radio" id={code} value={code} {...register("lang")} />
      </label>
    );
  }
}
