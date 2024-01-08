export const users = [
  {
    email: "toto@mail.fr",
    password: "toto",
    name: "Toto plantu",
    role: ["USER"],
    validate_account: true,
  },
  {
    email: "toto@gmail.com",
    name: "toto freuh",
    password: "toto",
    googleId: "123",
    role: ["USER"],
    validate_account: true,
  },
  {
    email: "tata@pasmail.com",
    password: "toto",
    name: "Jean propose",
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

export const offers = [
  {
    description: "une nouvelle offre",
    address: "123 rue de la vieille ville",
    city: "montpellier",
    zip: "34000",
    coordinates: "{lat: 34.23, lng: 32.36}",
    allow_advices: true,
    date_from: "2024-01-08",
    date_to: "2024-01-15",
    plantId: 1,
  },
];
