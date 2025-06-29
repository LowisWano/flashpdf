import prisma from "../src/lib/prisma"

async function main() {
  const DEBUG_USER_ID = process.env.DEBUG_USER_ID || "debug-user-id"

  // Upsert debug user
  await prisma.user.upsert({
    where: { id: DEBUG_USER_ID },
    update: {},
    create: {
      id: DEBUG_USER_ID,
      name: "Debug User",
    },
  })

  console.log(`✅ Debug user ensured (id: ${DEBUG_USER_ID}).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 