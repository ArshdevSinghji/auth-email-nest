"use client";

import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { fetchLoginCred } from "../utils/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slice/user.slice";
import { setVerify } from "../redux/slice/verify.slice";

export default function SignIn() {
  const route = useRouter();
  const dispatch = useAppDispatch();

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    )
      return;

    try {
      const response = await fetchLoginCred({ email, password });
      const data = await response.json();

      if (response.status === 400) {
        alert("User not found!");
        return;
      }

      if (response.ok) {
        // Dispatch each action separately
        dispatch(
          setUser({
            username: data.foundUser.username,
            email: data.foundUser.email,
            imageUrl: data.foundUser.image,
          })
        );

        dispatch(
          setVerify({
            isVerified: data.foundUser.emailDetails.isVerified,
          })
        );

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        route.push("/home");
      } else {
        alert("Login failed!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login");
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: "20rem",
        p: 2,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Stack
        component={"form"}
        action={handleSubmit}
        alignItems={"center"}
        gap={2}
        noValidate
      >
        <Typography variant="subtitle2">Put in your credentials</Typography>

        <TextField
          required
          name="email"
          label="email"
          type="email"
          size="small"
        />

        <TextField
          required
          name="password"
          label="password"
          type="password"
          size="small"
        />

        <Button type="submit" variant="outlined" size="small">
          sign in
        </Button>

        <Typography variant="subtitle2">
          Don't have an account? <Link href={"/signUp"}>SignUp</Link>
        </Typography>
      </Stack>
    </Paper>
  );
}
