import { prismaClient } from "../main";
import bcrypt from "bcrypt";

const main = async () => {
  await prismaClient.user.deleteMany({});
  await prismaClient.user.create({
    data: {
      name: "Albert",
      email: "georgeynr@gmail.com",
      password: bcrypt.hashSync("abc123", 10),
    },
  });
};

main()
  .then(() => {
    console.log("Seed finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
