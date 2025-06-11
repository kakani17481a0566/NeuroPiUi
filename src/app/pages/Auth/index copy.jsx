// Import Dependencies
// import { Link } from "react-router";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Local Imports
// import Logo from "assets/appLogo.svg?react";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { useState } from "react";
import "./Auth.css"; // Import custom styles for the auth page


// ----------------------------------------------------------------------

export default function SignIn() {
  const { login, errorMessage } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        username: data.username,
        password: data.password,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login" >
      {/* <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center" > */}
      <main className="auth-bg" >

        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          {/* <div className="text-center">
            <Logo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="dark:text-dark-100 text-2xl font-semibold text-gray-600">
                Welcome Back
              </h2>
              <p className="dark:text-dark-300 text-gray-400">
                Please sign in to continue
              </p>
            </div>
          </div> */}
          <Card className="mt-5 rounded-lg p-5 lg:p-7 bg">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="Username"
                  placeholder="Enter Username"
                  prefix={
                    <UserIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("username")}
                  error={errors?.username?.message}
                />
                <Input
                  label="Password"
                  placeholder="Enter Password"
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("password")}
                  error={errors?.password?.message}
                />
              </div>

              <div className="mt-2">
                <InputErrorMsg
                  when={errorMessage && errorMessage?.message !== ""}
                >
                  {errorMessage?.message}
                </InputErrorMsg>
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <Checkbox label="Remember me" />
                <a
                  href="##"
                  className="dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100 text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800"
                >
                  Forgot Password?
                </a>
              </div>

              {/* <Button type="submit" className="mt-5 w-full" color="primary">
                Sign In
              </Button> */}

              <Button
                type="submit"
                className="mt-5 w-full"
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1">
                    Signing In
                    <span className="dot-anim ml-1">
                      <span className="dot dot1">.</span>
                      <span className="dot dot2">.</span>
                      <span className="dot dot3">.</span>
                    </span>
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            {/* <div className="text-xs-plus mt-4 text-center">
              <p className="line-clamp-1">
                <span>Dont have Account?</span>{" "}
                <Link
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600 transition-colors"
                  to="/pages/sign-up-v1"
                >
                  Create account
                </Link>
              </p>
            </div> */}
            {/* <div className="my-7 flex items-center space-x-3 text-xs">
              <div className="dark:bg-dark-500 h-px flex-1 bg-gray-200"></div>
              <p>OR</p>
              <div className="dark:bg-dark-500 h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="flex gap-4">
              <Button className="h-10 flex-1 gap-3" variant="outlined">
                <img
                  className="size-5.5"
                  src="/images/logos/google.svg"
                  alt="logo"
                />
                <span>Google</span>
              </Button>
              <Button className="h-10 flex-1 gap-3" variant="outlined">
                <img
                  className="size-5.5"
                  src="/images/logos/github.svg"
                  alt="logo"
                />
                <span>Github</span>
              </Button>
            </div> */}
          </Card>
          <div className="dark:text-dark-300 mt-8 flex justify-center text-xs text-gray-400">
            <a href="##">Privacy Notice</a>
            <div className="dark:bg-dark-500 mx-2.5 my-0.5 w-px bg-gray-200"></div>
            <a href="##">Term of service</a>
          </div>
        </div>
      </main>
    </Page>
  );
}
