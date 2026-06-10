import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoDeals = [
  { company: "Northstar Labs", contact: "Maya Chen", value: 48000, stage: "Qualified", avatar: "MC", color: "violet", due: "Jun 12", activity: "Email opened 2h ago" },
  { company: "Oak & Co.", contact: "Jon Bell", value: 18500, stage: "Qualified", avatar: "JB", color: "amber", due: "Jun 14", activity: "Call logged yesterday" },
  { company: "Papertrail", contact: "Nina Shah", value: 32000, stage: "Proposal", avatar: "NS", color: "rose", due: "Jun 11", activity: "Quote viewed 38m ago" },
  { company: "Mode Systems", contact: "Theo Grant", value: 76000, stage: "Proposal", avatar: "TG", color: "blue", due: "Jun 16", activity: "Meeting booked" },
  { company: "Kanso Studio", contact: "Liv Morgan", value: 24500, stage: "Negotiation", avatar: "LM", color: "green", due: "Today", activity: "Replied 12m ago" },
  { company: "Juniper Health", contact: "Omar Reed", value: 92000, stage: "Negotiation", avatar: "OR", color: "cyan", due: "Jun 13", activity: "Legal review pending" },
  { company: "Arcworks", contact: "Sam Kim", value: 41000, stage: "Closing", avatar: "SK", color: "indigo", due: "Today", activity: "Contract sent 1h ago" },
];

async function main() {
  const password = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@folkline.io" },
    update: {},
    create: { name: "Jamie Davis", email: "demo@folkline.io", password },
  });

  for (const deal of demoDeals) {
    await prisma.deal.create({
      data: { ...deal, userId: user.id },
    });
  }

  console.log("Seeded demo user (demo@folkline.io / demo1234) with 7 deals.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
