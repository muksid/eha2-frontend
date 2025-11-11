// Local Imports
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";

// Import Dependencies
import Logo from "assets/appLogo.svg?react";
import DashboardMeet from "assets/illustrations/dashboard-meet.svg?react";
import { Button, Checkbox, Input } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../Auth/schema.js";
import { Page } from "../../../components/shared/Page.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { SIGNUP_URL } from "../../../constants/api.urls.js";

// Modal Imports
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Модалки
  const [successOpen, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);
  const [errorOpen, { open: openError, close: closeError }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    primaryColorScheme: primary,
    lightColorScheme: light,
    darkColorScheme: dark,
    isDark,
  } = useThemeContext();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(SIGNUP_URL, {
        name: data?.name,
        email: data?.email,
        password: data?.password,
        password_confirmation: data?.repeatPassword,
      });

      const payload = res?.data;

      if (payload?.success === true) {
        openSuccess();
      } else {
        setErrorMessage(payload?.message || "Registration failed. Please try again.");
        openError();
      }
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again later.";

      setErrorMessage(message);
      openError();
    }
  };

  const handleCloseSuccess = () => {
    closeSuccess();
    navigate("/login");
  };

  const handleCloseError = () => {
    closeError();
  };

  return (
      <Page title={'SignUp'}>
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
              <DashboardMeet
                  style={{
                    "--primary": primary[500],
                    "--dark-600": isDark ? dark[600] : light[700],
                    "--dark-450": dark[450],
                  }}
                  className="w-full"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center border-gray-150 bg-white dark:border-transparent dark:bg-dark-700 lg:max-w-md ltr:border-l rtl:border-r">
            <div className="flex w-full max-w-sm grow flex-col justify-center p-5">
              <div className="text-center">
                <Logo className="mx-auto size-16 lg:hidden" />
                <div className="mt-4 lg:mt-0">
                  <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                    Welcome To Tailux
                  </h2>
                  <p className="text-gray-400 dark:text-dark-300">
                    Please sign up to continue
                  </p>
                </div>
              </div>

              <div className="my-7 flex items-center text-tiny-plus">
                <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
                <p className="mx-3">SIGN UP WITH EMAIL</p>
                <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
              </div>

              <form className="mt-2" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="space-y-4">
                  <Input
                      unstyled
                      placeholder="Username"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={<UserIcon className="size-5 transition-colors duration-200" strokeWidth="1" />}
                      {...register("name")}
                      error={errors?.name?.message}
                  />
                  <Input
                      unstyled
                      placeholder="Email"
                      type="email"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={<EnvelopeIcon className="size-5 transition-colors duration-200" strokeWidth="1" />}
                      {...register("email")}
                      error={errors?.email?.message}
                  />
                  <Input
                      unstyled
                      type="password"
                      placeholder="Password"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={<LockClosedIcon className="size-5 transition-colors duration-200" strokeWidth="1" />}
                      {...register("password")}
                      error={errors?.password?.message}
                  />
                  <Input
                      unstyled
                      type="password"
                      placeholder="Repeat Password"
                      className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                      prefix={<LockClosedIcon className="size-5 transition-colors duration-200" strokeWidth="1" />}
                      {...register("repeatPassword")}
                      error={errors?.repeatPassword?.message}
                  />
                  <div className="flex gap-1">
                    <Checkbox label="I agree with" />
                    <a
                        href="##"
                        className="text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                    >
                      privacy policy
                    </a>
                  </div>
                </div>
                <Button type="submit" color="primary" className="mt-8 h-10 w-full">
                  Sign Up
                </Button>
              </form>

              <div className="mt-4 text-center text-xs-plus">
                <p className="line-clamp-1">
                  <span>Already have an account?</span>{" "}
                  <Link
                      className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                      to="/login"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            <div className="mb-3 flex justify-center text-xs text-gray-400 dark:text-dark-300">
              <a href="##">Privacy Notice</a>
              <div className="mx-2.5 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
              <a href="##">Term of service</a>
            </div>
          </div>
        </main>

        {/* === Успешная регистрация === */}
        <Transition appear show={successOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" onClose={closeSuccess}>
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
            </TransitionChild>
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="scrollbar-sm relative flex max-w-md flex-col overflow-y-auto rounded-lg bg-white px-4 py-10 text-center transition-all duration-300 dark:bg-dark-700 sm:px-5">
                <CheckCircleIcon className="mx-auto inline size-28 shrink-0 text-success" />
                <div className="mt-4">
                  <DialogTitle as="h3" className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
                    Registration Successful!
                  </DialogTitle>
                  <p className="mt-2 text-gray-600 dark:text-dark-200">
                    Welcome to Tailux! Your account has been created successfully.
                  </p>
                  <Button onClick={handleCloseSuccess} color="success" className="mt-6">
                    Continue to Login
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </Dialog>
        </Transition>

        {/* === Ошибка регистрации === */}
        <Transition appear show={errorOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" onClose={closeError}>
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
            </TransitionChild>
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <DialogPanel className="scrollbar-sm relative flex max-w-md flex-col overflow-y-auto rounded-lg bg-white px-4 py-10 text-center transition-all duration-300 dark:bg-dark-700 sm:px-5">
                <XCircleIcon className="mx-auto inline size-14 shrink-0 text-danger" />
                <div className="mt-4 px-20">
                  <DialogTitle as="h3" className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
                    Registration Failed
                  </DialogTitle>
                  <p className="mt-2 text-gray-600 dark:text-dark-200 whitespace-pre-wrap text-sm">
                    {errorMessage}
                  </p>
                  <Button onClick={handleCloseError} color="error" className="mt-6">
                    Try Again
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </Dialog>
        </Transition>
      </Page>
  );
}
