"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  fetchVerificationCode,
  sendMail,
  updateUserProfileImage,
  updateVerify,
} from "../utils/auth";
import { setVerify } from "../redux/slice/verify.slice";

const Home = () => {
  const user = useAppSelector((state) => state.user);
  const isVerified = useAppSelector((state) => state.isVerified.isVerified);
  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [code, setCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleSendMail = async () => {
    setIsLoading(true);
    try {
      await sendMail(user.email);
      setCode(await fetchVerificationCode(user.email));
      setOpenDialog(true);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    if (Number(otp) !== code) return;

    try {
      await updateVerify(user.email);

      dispatch(setVerify({ isVerified: true }));

      setOpenDialog(false);
      setOtp("");
      setOtpError("");

      alert("Email verified successfully!");
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOtp("");
    setOtpError("");
  };

  const handleImage = () => {
    setImage(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    setIsUploading(true);

    // Create FormData for multipart upload
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    uploadFormData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
    );
    uploadFormData.append(
      "cloud_name",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);

      await updateUserProfileImage(user.email, data.secure_url);

      alert("Image uploaded successfully!");
      setImage(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography variant="h2">{user.username}</Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Button
              disabled={isVerified || isLoading}
              variant="outlined"
              onClick={handleSendMail}
            >
              {isLoading
                ? "Sending..."
                : isVerified
                ? "Verified ✓"
                : "Send Verification Email"}
            </Button>
          </Grid>
          <Grid size={4}>
            <Stack spacing={2} alignItems={"center"}>
              {user.imageUrl ? (
                <Avatar
                  src={`${user.imageUrl}`}
                  sx={{ width: 76, height: 76 }}
                />
              ) : (
                <Avatar />
              )}
              {!image ? (
                <Button onClick={handleImage} variant="contained">
                  edit image
                </Button>
              ) : (
                <Box
                  component={"form"}
                  action={handleImageUpload}
                  noValidate
                  sx={{ width: "100%" }}
                >
                  <Stack spacing={2} alignItems={"center"}>
                    <TextField
                      type="file"
                      inputProps={{
                        accept: "image/*",
                      }}
                      onChange={handleFileChange}
                      helperText={
                        uploadError || "Select an image file (max 5MB)"
                      }
                      error={!!uploadError}
                      fullWidth
                    />

                    {selectedFile && (
                      <Typography variant="body2" color="text.secondary">
                        Selected: {selectedFile.name}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!selectedFile || isUploading}
                        size="small"
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>

                      <Button
                        onClick={() => {
                          setImage(false);
                          setSelectedFile(null);
                          setUploadError("");
                        }}
                        variant="outlined"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" align="center">
            Email Verification
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a 6-digit verification code to your email address. Please
            enter it below.
          </Typography>

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setOtpError("");
            }}
            error={!!otpError}
            helperText={otpError}
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                fontSize: "1.2rem",
                letterSpacing: "0.5rem",
              },
            }}
            placeholder="000000"
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            disabled={!otp || otp.length !== 6}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
