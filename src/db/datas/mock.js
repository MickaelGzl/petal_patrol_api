export const users = [
  {
    email: "toto@mail.fr",
    password: "toto",
    name: "toto",
    role: ["USER"],
    validate_account: true,
  },
  {
    email: "toto@gmail.com",
    name: "tonton google",
    password: "toto",
    googleId: "123",
    role: ["USER"],
    validate_account: true,
  },
  {
    email: "tata@pasmail.com",
    password: "toto",
    name: "tata foConte",
    role: ["USER"],
    validate_account: false,
  },
  {
    email: "tutu@mail.com",
    password: "toto",
    name: "tutu",
    role: ["ADMIN", "USER"],
    validate_account: true,
  },
];

export const roles = [
  {
    role: "USER",
  },
  {
    role: "ADMIN",
  },
  {
    role: "BOTANIST",
  },
];

export const plants = [
  {
    name: "racine",
    images: JSON.stringify(["uneUrl.jpg", "imagename2.png", "file3.jfif"]),
    user: 1,
  },
];
