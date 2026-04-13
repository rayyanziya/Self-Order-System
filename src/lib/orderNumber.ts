import prisma from "./prisma";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function pad(n: number): string {
  return String(n).padStart(3, "0");
}

export async function generateOrderNumber(
  hasFood: boolean,
  hasDrink: boolean,
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<string> {
  const today = formatDate(new Date());

  const prefix = hasFood && hasDrink ? "AB" : hasFood ? "A" : "B";

  const counter = await tx.dailyCounter.upsert({
    where: { date: today },
    update: { counter: { increment: 1 } },
    create: { date: today, counter: 1 },
  });

  return `${prefix}-${pad(counter.counter)}`;
}
