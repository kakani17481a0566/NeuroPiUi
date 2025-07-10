import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Card, Input, InputErrorMsg } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Auth.css";
import { getSessionData } from "utils/sessionStorage";

export default function SignIn() {
  const navigate = useNavigate();
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
      const { role } = getSessionData();

      if (role?.toLowerCase() === "nanny") {
        navigate("/dashboards/attendance");
      } else {
        navigate("/dashboards");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login">
      <main className="auth-bg">
        <div className="auth-card-container">
          <Card className="auth-card">
            <div className="auth-left-img" tabIndex={-1} />
            <div className="auth-right-form">
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="auth-inputs">
                  <div className="input-horizontal">
                    <label className="input-label" htmlFor="username">
                      Username
                    </label>
                    <Input
                      id="username"
                      aria-label="Username"
                      prefix={
                        <UserIcon
                          className="size-5"
                          strokeWidth="1"
                          style={{ color: "#1A4255" }}
                        />
                      }
                      {...register("username")}
                      error={errors?.username?.message}
                      className="input-black-text h-8 py-1 text-xs"
                    />
                  </div>

                  <div className="input-horizontal">
                    <label className="input-label" htmlFor="password">
                      Password
                    </label>
                    <Input
                      id="password"
                      aria-label="Password"
                      type="password"
                      prefix={
                        <LockClosedIcon
                          className="size-5"
                          strokeWidth="1"
                          style={{ color: "#1A4255" }}
                        />
                      }
                      {...register("password")}
                      error={errors?.password?.message}
                      className="input-black-text h-8 py-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <InputErrorMsg when={errorMessage?.message}>
                    <span
                      style={{
                        color: "#B14434",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      {errorMessage?.message}
                    </span>
                  </InputErrorMsg>
                </div>

                <Button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="dot-wrapper">
                      Signing In
                      <span className="dot-anim">
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
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
