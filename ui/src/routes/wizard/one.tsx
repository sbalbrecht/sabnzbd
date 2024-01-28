import { useState } from "react";
import { Trans, t } from "@lingui/macro";
import { FileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import classNames from "classnames";
import { pingTestServer } from "../../api/api";
import {
  ConfigServer,
  headerQueryOptions,
  serverQueryOptions,
} from "../../api/common";
import "./wizard.css";

export const Route = new FileRoute("/wizard/one").createRoute({
  loader: async ({ context: { queryClient } }) => {
    const headerQuery = queryClient.ensureQueryData(headerQueryOptions());
    const serverQuery = queryClient.ensureQueryData(serverQueryOptions());
    const [header, server] = await Promise.all([headerQuery, serverQuery]);
    return { header, server };
  },
  component: WizardServerConfiguration,
});

const FormSchema = z.object({
  server: z.string(),
  host: z.string().min(1),
  username: z.string(),
  password: z.string(),
  ssl: z.boolean(),
  port: z.coerce.number(),
  connections: z.coerce.number().min(1),
  ssl_verify: z.number(),
});

type FormData = z.infer<typeof FormSchema>;

// Final jQuery remnant
// $('[data-toggle="tooltip"]').tooltip();

function WizardServerConfiguration() {
  const { header, server } = Route.useLoaderData();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: server,
    values: server,
    mode: "onTouched",
    resolver: zodResolver(FormSchema),
  });

  const setSslPort = () => {
    const port = getValues("port");
    if (getValues("ssl")) {
      // Enabled SSL change port when not already a custom port
      // == because port is actually a string until submission
      if (port == 119) {
        console.log("Setting to 563");
        setValue("port", 563, { shouldTouch: true });
      }
    } else {
      // Remove SSL port
      if (port == 563) {
        setValue("port", 119, { shouldTouch: true });
      }
    }
  };

  const onSubmit = (data: FormData) => {
    alert(JSON.stringify(data));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              <script type="text/javascript"></script>
              <h3>
                <Trans>Server Details</Trans>
              </h3>
              <Trans>
                Please enter in the details of your primary usenet provider.
              </Trans>
              <br />
              <br />
              <br />
              <input type="hidden" {...register("server")} />
              <div className="row">
                <div className="col-md-7 form-horizontal">
                  <div className="form-group">
                    <label htmlFor="host" className="col-sm-4 control-label">
                      <Trans>Host</Trans>
                    </label>
                    <div className="col-sm-8">
                      <input
                        className={classNames({
                          "form-control": true,
                          correct: touchedFields.host && !errors.host,
                          incorrect: touchedFields.host && errors.host,
                        })}
                        id="host"
                        placeholder={`${t`E.g.`} news.newshosting.com`}
                        {...register("host")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="username"
                      className="col-sm-4 control-label"
                    >
                      <Trans>Username</Trans>
                    </label>
                    <div className="col-sm-8">
                      <input
                        className={classNames({
                          "form-control": true,
                          correct: touchedFields.username && !errors.username,
                          incorrect: touchedFields.username && errors.username,
                        })}
                        id="username"
                        {...register("username")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="password"
                      className="col-sm-4 control-label"
                    >
                      <Trans>Password</Trans>
                    </label>
                    <div className="col-sm-8">
                      <input
                        className={classNames({
                          "form-control": true,
                          correct: touchedFields.password && !errors.password,
                          incorrect: touchedFields.password && errors.password,
                        })}
                        id="password"
                        {...register("password")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ssl" className="col-sm-4 control-label">
                      <Trans>SSL</Trans>
                    </label>
                    <div className="col-sm-8 input-checkbox">
                      <input
                        type="checkbox"
                        id="ssl"
                        onClick={setSslPort}
                        data-toggle="tooltip"
                        data-placement="right"
                        title={t`Select only if your provider allows SSL connections.`}
                        {...register("ssl")}
                      />
                    </div>
                  </div>
                  <AdvancedSettings
                    register={register}
                    errors={errors}
                    touchedFields={touchedFields}
                  />
                  <TestServerButton apikey={header["apikey"]} server={server} />
                </div>
                <div className="col-md-5">
                  <div className="clearfix"></div>
                  <iframe
                    style={{ float: "right", width: "325px", height: "325px" }}
                    frameBorder="0"
                    src={`https://sabnzbd.org/wizard#${header["active_lang"]}`}
                  ></iframe>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-xs-4 text-center">
                <Link className="btn btn-default" to="/wizard/">
                  <span className="glyphicon glyphicon-chevron-left"></span>{" "}
                  <Trans>Previous</Trans>
                </Link>
              </div>
              <div className="col-xs-4 text-center"></div>
              <div className="col-xs-4 text-center">
                <button
                  className={`btn btn-default ${
                    !server.host || !server.connections ? "disabled" : ""
                  }`}
                  id="next-button"
                >
                  <Trans>Next</Trans>{" "}
                  <span className="glyphicon glyphicon-chevron-right"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

type TouchedFields = Partial<
  Readonly<{
    [key in keyof FormData]: boolean | undefined;
  }>
>;

type AdvancedSettingsProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  touchedFields: TouchedFields;
};

const AdvancedSettings = ({
  register,
  errors,
  touchedFields,
}: AdvancedSettingsProps) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  if (!showAdvancedSettings) {
    return (
      <div className="form-group">
        <div className="col-sm-4"></div>
        <div className="col-sm-8">
          <a
            href="#"
            className="wizard-advanced-settings"
            onClick={() => setShowAdvancedSettings(true)}
          >
            <span className="glyphicon glyphicon-cog"></span>{" "}
            <Trans>Advanced</Trans>
          </a>
        </div>
      </div>
    );
  }

  const sslVerifyOptions = [
    { val: 2, text: <Trans>Strict</Trans> },
    { val: 1, text: <Trans>Normal</Trans> },
    { val: 0, text: <Trans>Disabled</Trans> },
  ];

  return (
    <div id="server-hidden-settings">
      <div className="form-group">
        <label htmlFor="port" className="col-sm-4 control-label">
          <Trans>Port</Trans>
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            className={classNames({
              "form-control": true,
              correct: touchedFields.port && !errors.port,
              incorrect: touchedFields.port && errors.port,
            })}
            id="port"
            {...register("port")}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="connections" className="col-sm-4 control-label">
          <Trans>Connections</Trans>
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            className={classNames({
              "form-control": true,
              correct: touchedFields.connections && !errors.connections,
              incorrect: touchedFields.connections && errors.connections,
            })}
            id="connections"
            data-toggle="tooltip"
            data-placement="right"
            title={`${t`The number of connections allowed by your provider`} ${t`E.g. 8 or 20`}`}
            {...register("connections")}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ssl_verify" className="col-sm-4 control-label">
          <Trans>Certificate verification</Trans>
        </label>
        <div className="col-sm-8">
          <select
            id="ssl_verify"
            className="form-control"
            {...register("ssl_verify")}
          >
            {sslVerifyOptions.map((option) => (
              <option value={option.val} key={option.val}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

type TestServerProps = {
  apikey: string;
  server: ConfigServer;
};

const TestServerButton = ({ apikey, server }: TestServerProps) => {
  const { data, error, isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: ({ apikey, server }: TestServerProps) =>
      pingTestServer(apikey, server),
  });

  return (
    <div className="row">
      <div className="col-sm-4">
        <button
          id="serverTest"
          className="btn btn-default"
          onClick={() => mutate({ apikey, server })}
        >
          <span className="glyphicon glyphicon-sort"></span>{" "}
          <Trans>Test Server</Trans>
        </button>
      </div>
      <div className="col-sm-8">
        <div id="serverResponse" className="well well-sm">
          {isSuccess ? (
            <span className="success">
              <span className="glyphicon glyphicon-ok"></span>
              {data}
            </span>
          ) : isError ? (
            <span className="failed">
              <span className="glyphicon glyphicon-minus-sign"></span>
              {error.message}
            </span>
          ) : isPending ? (
            <Trans>Testing server details...</Trans>
          ) : (
            <Trans>Click to test the entered details.</Trans>
          )}
        </div>
      </div>
    </div>
  );
};
