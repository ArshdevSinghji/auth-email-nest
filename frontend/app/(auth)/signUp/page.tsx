"use client";

import { fetchRegisterCred } from "@/app/utils/auth";
import { SignUpSchema, TSignUpSchema } from "@/app/utils/formValidation";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUp() {
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username ||
      !email ||
      !password
    )
      return;

    try {
      const response = await fetchRegisterCred({ username, email, password });
      const data = await response.json();

      if (response.status === 409) {
        alert("User already exists");
        return;
      }

      alert("Account created successfully! Please sign in.");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration");
    }
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
  });

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
        // action={handleSubmit}
        onSubmit={handleSubmit(() => onSubmit)}
        alignItems={"center"}
        gap={2}
        noValidate
      >
        <Typography variant="subtitle2">Put in your credentials</Typography>

        <TextField
          required
          {...register("username")}
          error={!!errors.username}
          helperText={errors?.username?.message}
          id="outlined"
          name="username"
          label="username"
          type="text"
          size="small"
        />
        <TextField
          required
          {...register("email")}
          error={!!errors.email}
          helperText={errors?.email?.message}
          name="email"
          label="email"
          type="email"
          size="small"
        />

        <TextField
          required
          {...register("password")}
          error={!!errors.password}
          helperText={errors?.password?.message}
          name="password"
          label="password"
          type="password"
          size="small"
        />

        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={isSubmitting}
        >
          sign up
        </Button>

        <Typography variant="subtitle2">
          Alerady have an account? <Link href={"/"}>SignIn</Link>
        </Typography>
      </Stack>
    </Paper>
  );
}
