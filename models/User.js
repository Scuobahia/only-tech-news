const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}
// define tale columns and configuration
User.init(
  {
      // define an id column
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      //Define a username column
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      //Define a password 
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          //Password must be at least four characters long
          len: [4]
        }
      }
    },
{
  
  hooks: {
          // Set up beforeCreate lifecycle "hook" functionality
          async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
          },
          // Set up beforeUpdate lifecycle "hook" functionality
          async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
          }
  },

  // Pass sequelize connection 
  sequelize,
  // Don't automatically create createdAt/updatedAt timestamp fields
  timestamps: false,
  // Don't pluralize
  freezeTableName: true,
  // Use underscores instead of camel-casing
  underscored: true,
  // Make it so our model name stays lowercase
  modelName: 'user'
}
);

module.exports = User;
