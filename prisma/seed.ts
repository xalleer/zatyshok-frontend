import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Role, UnitType, CancellationPolicy, BookingMode } from "@/lib/generated/prisma/enums"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Власник
  const host = await prisma.user.create({
    data: {
      name: "Іван Петренко",
      email: "host@test.com",
      phone: "+380501234567",
      role: Role.HOST,
    },
  })

  // База 1
  await prisma.property.create({
    data: {
      slug: "verholy",
      name: "Садиба «Верховина»",
      description: "Затишний куточок в Карпатах з неймовірним краєвидом.",
      coverImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
      city: "Верховина",
      region: "Івано-Франківська",
      latitude: 48.1534,
      longitude: 24.8211,
      isActive: true,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      bookingMode: BookingMode.INSTANT,
      hostId: host.id,
      amenities: {
        create: [
          { icon: "wifi", label: "Wi-Fi" },
          { icon: "flame", label: "Чан" },
          { icon: "fish", label: "Риболовля" },
        ],
      },
      units: {
        create: [
          {
            name: "A-Frame з чаном",
            description: "Романтичний будиночок на двох з панорамним видом.",
            pricePerNight: 2500,
            type: UnitType.AFRAME,
            maxGuests: 2,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", order: 0 },
                { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", order: 1 },
              ],
            },
            amenities: {
              create: [
                { icon: "flame", label: "Чан" },
                { icon: "wifi", label: "Wi-Fi" },
              ],
            },
          },
          {
            name: "Глемпінг «Ліс»",
            description: "Розкішний намет серед лісу з усіма зручностями.",
            pricePerNight: 1800,
            type: UnitType.GLAMPING,
            maxGuests: 4,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", order: 0 },
              ],
            },
            amenities: { create: [{ icon: "trees", label: "Ліс" }] },
          },
        ],
      },
    },
  })

  // База 2
  await prisma.property.create({
    data: {
      slug: "lisova-kazka",
      name: "Лісова казка",
      description: "Будиночки в лісі поблизу озера.",
      coverImage: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
      city: "Яремче",
      region: "Івано-Франківська",
      latitude: 48.4576,
      longitude: 24.5549,
      isActive: true,
      ratingAvg: 4.8,
      ratingCount: 12,
      hostId: host.id,
      amenities: {
        create: [
          { icon: "waves", label: "Озеро" },
          { icon: "car", label: "Паркінг" },
        ],
      },
      units: {
        create: [
          {
            name: "Будиночок «Сосна»",
            pricePerNight: 3200,
            type: UnitType.HOUSE,
            maxGuests: 6,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1542718610-a1e7f51306ae?w=800&q=80", order: 0 },
                { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80", order: 1 },
                { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", order: 2 },
              ],
            },
            amenities: {
              create: [
                { icon: "bed-double", label: "2 спальні" },
                { icon: "wifi", label: "Wi-Fi" },
              ],
            },
          },
        ],
      },
    },
  })

  console.log("✅ Seed завершено")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
