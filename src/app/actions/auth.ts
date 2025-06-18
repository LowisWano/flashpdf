"use server"

export async function login(formData: FormData) {
  const { email, password } = Object.fromEntries(formData.entries());
  console.log(email, password)
}