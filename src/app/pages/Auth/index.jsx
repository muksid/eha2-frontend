import { Link, useNavigate } from "react-router";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// Local Imports
import Logo from "assets/appLogo.svg?react";
import DashboardCheck from "assets/illustrations/dashboard-check.svg?react";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearLoginError } from "store/authSlice.js";
import { useThemeContext } from "app/contexts/theme/context";
import { ErrorModal } from "components/custom/modals/ErrorModal";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, loginError, isAuthenticated } = useSelector((state) => state.auth);

  const [serverError, setServerError] = useState(null);

  const {
    primaryColorScheme: primary,
    lightColorScheme: light,
    darkColorScheme: dark,
    isDark,
  } = useThemeContext();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { login: "", password: "" },
  });

  useEffect(() => {
    dispatch(clearLoginError());
    setServerError(null);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && status === 'succeeded') {
      navigate('/dashboards/home', { replace: true });
    }
  }, [isAuthenticated, status, navigate]);


  useEffect(() => {
    if (status === 'failed' && loginError) {
      if (typeof loginError === 'object') {
        if (loginError.message) {
          setServerError(loginError.message);
        }
        if (loginError.errors?.login) {
          setError("login", {
            type: "server",
            message: loginError.errors.login
          });
        }
        if (loginError.errors?.password) {
          setError("password", {
            type: "server",
            message: loginError.errors.password
          });
        }
      }
      else if (typeof loginError === 'string') {
        setServerError(loginError);
      }
    }
  }, [status, loginError, setError]);

  const onSubmit = (data) => {
    setServerError(null);
    dispatch(loginUser({ login: data.login, password: data.password }));
  };

  return (
      <Page title="Login">
        <main className="min-h-100vh flex">
          <div className="fixed top-0 hidden p-6 lg:block lg:px-12">
            <div className="flex items-center gap-2">
              <Logo className="size-12" />
              <p className="text-xl font-semibold uppercase text-gray-800 dark:text-dark-100">
                tailux
              </p>
            </div>
          </div>

          <div className="hidden w-full place-items-center lg:grid">
            <div className="w-full max-w-lg p-6">
              <DashboardCheck
                  style={{
                    "--primary": primary[500],
                    "--dark-500": isDark ? dark[500] : light[200],
                    "--dark-600": isDark ? dark[600] : light[100],
                    "--dark-700": isDark ? dark[700] : light[300],
                    "--dark-450": isDark ? dark[450] : light[400],
                    "--dark-800": isDark ? dark[800] : light[400],
                  }}
                  className="w-full"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center ltr:border-l rtl:border-r border-gray-150 bg-white dark:border-transparent dark:bg-dark-700 lg:max-w-md">
            <div className="flex w-full max-w-sm grow flex-col justify-center p-5">
              <div className="text-center">
                <Logo className="mx-auto size-16 lg:hidden" />
                <div className="mt-4 lg:mt-0">
                  <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400 dark:text-dark-300">
                    Please sign in to continue
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="mt-16">
                <div className="space-y-4">
                  <Input
                      unstyled
                      placeholder="Enter login"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={
                        <EnvelopeIcon
                            className="size-5 transition-colors duration-200"
                            strokeWidth="1"
                        />
                      }
                      {...register("login")}
                      error={errors?.login?.message}
                      disabled={status === 'loading'}
                  />
                  <Input
                      unstyled
                      type="password"
                      placeholder="Enter Password"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={
                        <LockClosedIcon
                            className="size-5 transition-colors duration-200"
                            strokeWidth="1"
                        />
                      }
                      {...register("password")}
                      error={errors?.password?.message}
                      disabled={status === 'loading'}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between space-x-2">
                  <Checkbox label="Remember me" />
                  <a
                      href="##"
                      className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                  >
                    Forgot Password?
                  </a>
                </div>

                <Button
                    type="submit"
                    color="primary"
                    className="mt-10 h-10 w-full"
                    disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-4 text-center text-xs-plus">
                <p className="line-clamp-1">
                  <span>Dont have Account?</span>{" "}
                  <Link
                      className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                      to="/signup"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        <ErrorModal message={serverError} />
      </Page>
  );
}
