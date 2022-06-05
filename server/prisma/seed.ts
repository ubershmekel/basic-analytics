import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  console.log(`Start seeding ...`);
  const event = await prisma.event.create({
      data: {
        key: 'pageview',
        domain: 'www.example.com',
        sessionId: 'asdfasdfasdfasdfa',
        userAgent: ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
        ip: '127.0.0.1',
      },
    });
  console.log(`Created event with id: ${event.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
