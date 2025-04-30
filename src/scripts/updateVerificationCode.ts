// import { PrismaClient } from '@prisma/client';
// import { nanoid } from 'nanoid';

// const prisma = new PrismaClient();

// async function main() {
//   const users = await prisma.users.findMany({
//     where: {
//       kode_verifikasi: ''
//     }
//   });

//   for (const user of users) {
//     const kodeBaru = nanoid(16);
//     const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // +24 jam

//     await prisma.users.update({
//       where: { id: user.id },
//       data: {
//         kode_verifikasi: kodeBaru,
//         verifikasi_exp: expiredAt
//       }
//     });

//     console.log(`✅ User ${user.username} → kode: ${kodeBaru} (expires: ${expiredAt.toISOString()})`);
//   }

//   console.log('🎉 Semua user berhasil diupdate!');
// }

// main()
//   .catch(e => console.error('❌ Error:', e))
//   .finally(() => prisma.$disconnect());
