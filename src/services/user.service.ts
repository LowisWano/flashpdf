import prisma from "@/lib/prisma"

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}