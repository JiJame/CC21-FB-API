import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.config.js";

const hashedPassword = bcrypt.hashSync("123456", 8);
const userData = [
  {
    firstName: "Andy",
    lastName: "Codecamp",
    password: hashedPassword,
    email: "andy@ggg.mail",
    profileImage: "https://www.svgrepo.com/show/420364/avatar-male-man.svg",
  },
  {
    firstName: "Bobby",
    lastName: "Codecamp",
    password: hashedPassword,
    email: "bobby@ggg.mail",
    profileImage:
      "https://www.svgrepo.com/show/420319/actor-chaplin-comedy.svg",
  },
  {
    firstName: "Candy",
    lastName: "Codecamp",
    password: hashedPassword,
    mobile: "1111111111",
    profileImage: "https://www.svgrepo.com/show/420327/avatar-child-girl.svg",
  },
  {
    firstName: "Danny",
    lastName: "Codecamp",
    password: hashedPassword,
    mobile: "2222222222",
    profileImage:
      "https://www.svgrepo.com/show/420314/builder-helmet-worker.svg",
  },
];

async function seedDB() {
  // รันคำสั่งยัดข้อมูล
  await prisma.user.createMany({ data: userData, skipDuplicates: true });
}

seedDB()
  .then(() => console.log("DB Seed successful"))
  .catch((err) => console.log(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
