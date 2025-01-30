import { DataTypes } from "sequelize";

const ID = {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4,
  allowNull: false,
  unique: true,
};

const DEFAULT = {
  STRING: "Default",
  INTEGER: 0,
};

const attr = {
  id: ID,
  default: DEFAULT,
};

export default attr;
