export async function fetchLoginCred(user: {
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:3000/auth/signIn", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res;
}

export async function fetchRegisterCred(user: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:3000/auth/signUp", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res;
}

export async function sendMail(email: string) {
  try {
    await fetch(`http://localhost:3000/mail/${email}`, {
      method: "post",
    });
  } catch (err) {
    console.error(err);
  }
}

export async function fetchVerificationCode(email: string) {
  try {
    const res = await fetch(`http://localhost:3000/user/${email}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.emailDetails.verificationCode;
  } catch (err) {
    console.error("Error fetching verification code:", err);
    throw err;
  }
}

export async function updateVerify(email: string) {
  try {
    await fetch(`http://localhost:3000/email/${email}`, {
      method: "post",
    });
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserProfileImage(email: string, imageURL: string) {
  const user = { email, imageURL };
  try {
    const response = await fetch("http://localhost:3000/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error updating user profile image:", err);
    throw err;
  }
}
