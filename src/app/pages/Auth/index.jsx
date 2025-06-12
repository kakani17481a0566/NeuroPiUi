import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Card, Input, InputErrorMsg } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { useState } from "react";
import { useNavigate  } from "react-router-dom";

import "./Auth.css";

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
        navigate("/dashboards/Teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login">
      <main className="auth-bg">
        <div className="auth-card-container">
          <Card className="auth-card">
            {/* Left: Image Panel */}
            <div className="auth-left-img" tabIndex={-1}></div>

            {/* Right: Login Form */}
            <div className="auth-right-form">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Please enter your credentials to sign in.</p>

              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="auth-inputs">
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    prefix={<UserIcon className="size-5" strokeWidth="1" />}
                    {...register("username")}
                    error={errors?.username?.message}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    prefix={<LockClosedIcon className="size-5" strokeWidth="1" />}
                    {...register("password")}
                    error={errors?.password?.message}
                  />
                </div>

                <div className="auth-error">
                  <InputErrorMsg when={errorMessage?.message}>
                    {errorMessage?.message}
                  </InputErrorMsg>
                </div>

                <Button
                  type="submit"
                  className="auth-button"
                  color="primary"
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

              {/* Optional Divider */}
              <div className="auth-divider"></div>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
