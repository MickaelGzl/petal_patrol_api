import { Offer, Plant, Role, User } from "../server.js";
import { users, roles, plants, offers } from "./mock.js";
import { hashSync } from "bcrypt";

export const createData = async () => {
  const allRoles = await Promise.all(
    roles.map(async (role) => {
      const newRole = Role.create({ ...role });
      return newRole;
    })
  );

  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = hashSync(user.password, 12);

      const newUser = await User.create({ ...user, password: hashedPassword });
      user.role.map((role) => {
        const sameRole = allRoles.find((dbRole) => dbRole.role === role);
        newUser.addRole(sameRole);
      });
    })
  );

  await Promise.all(
    plants.map(async (plant) => {
      const newPlant = await Plant.create({ ...plant });
      newPlant.setUser(plant.user);
    })
  );

  await Promise.all(
    offers.map(async (offer) => {
      const newOffer = await Offer.create({ ...offer });
      newOffer.setPlant(offer.plantId);
      newOffer.setOwner(1);
    })
  );
};
