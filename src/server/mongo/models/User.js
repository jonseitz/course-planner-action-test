import { Schema } from "mongoose";

/**
 * Enum for user access levels.
 * @enum {string}
 */
const AccessLevel = {
  READ_ONLY: "Read-Only",
  PRIVILEGED: "Privileged",
  ADMIN: "Admin"
};
let accessLevels = [];
for (let key of Object.keys(AccessLevel)) {
  accessLevels.push(AccessLevel[key]);
}

/**
 * The Schema for a User.
 */
export const UserSchema = new Schema(
  {
    HUID: { type: String, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    accessLevel: { type: String, enum: accessLevels, default: accessLevels[0] },
    settings: {}
  },
  {
    timestamps: true,
    collection: "users"
  }
);

/**
 * Creates a new user with the given data. Then executes the given callback function, handing it
 * either an object that contains an error or the new user object.
 * @param {Object}           data
 * @param {string}           data.HUID
 * @param {string}           data.firstName
 * @param {string}           data.lastName
 * @param {User.AccessLevel} data.accessLevel
 * @param {Object}           [data.settings]
 * @param {Function}         cb
 */

UserSchema.statics.addNew = async function(data) {
  try {
    let user = new this(data);
    return await user.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Error: That HUID is already in use.`);
    } else if (err.name === "ValidationError") {
      throw new Error(`Error: Invalid permission provided.`);
    } else {
      throw new Error(`Error: Could not create a new user\nError: ${err}`);
    }
  }
};

/**
 * Retrieves all of the users. Then executes the given callback function, handing it either an
 * object that contains an error or the array of user objects.
 * @param {Function} cb
 */
UserSchema.statics.getAll = async function getAll() {
  try {
    return await this.find().exec();
  } catch (err) {
    throw new Error(`Could not fetch all user records`);
  }
};

/**
 * Retrieves the user with the given ID. Then executes the given callback function, handing it
 * either an object that contains an error or the user object.
 * @param {string}   userId
 * @param {Function} cb
 */
UserSchema.statics.getOneById = async function getOne(userId) {
  try {
    return await this.findById(userId).exec();
  } catch (err) {
    throw new Error(`No user record for ${userId}\nError: ${err}`);
  }
};

/**
 * Retrieves the user with the given HUID. Then executes the given callback function, handing it
 * either an object that contains an error or the user object.
 * @param {string}   HUID
 * @param {Function} cb
 */
UserSchema.statics.getOneByHUID = async function getOneByHUID(HUID) {
  try {
    return await this.findOne({ HUID: HUID }).exec();
  } catch (err) {
    throw new Error(`No user record with HUID ${HUID}.\nError: ${err}`);
  }
};

/**
 * Updates the user with the given ID, using the given data. Only fields present in the data object
 * will be updated. Then executes the given callback function, handing it either an object that
 * contains an error or the updated user object.
 * @param {string}          userId
 * @param {Object}          data
 * @param {string}          [data.HUID]
 * @param {string}          [data.firstName]
 * @param {string}          [data.lastName]
 * @param {UserAccessLevel} [data.accessLevel]
 * @param {Object}          [data.settings]
 * @param {Function}        cb
 */
UserSchema.methods.update = async function update(data) {
  let user = this;
  try {
    UserSchema.eachPath(prop => {
      if (prop in data && user[prop] !== data[prop]) {
        user.set(prop, data[prop]);
      }
    });
    return await user.save();
  } catch (err) {
    throw new Error(`Unable to ubdate user with id ${user.id}\nError: ${err}`);
  }
};

/**
 * Deletes a person
 **/

UserSchema.methods.delete = async function() {
  let user = this;
  try {
    return await user.remove();
  } catch (err) {
    throw new Error(`Could not delete user with id ${user.id}.\nError: ${err}`);
  }
};
//
// /**
//  * Updates the user using the given data. Only fields present in the data object will be updated.
//  * Then executes the given callback function, handing it either an object that contains an error or
//  * the updated user object.
//  * @param {Object}           data
//  * @param {string}           [data.HUID]
//  * @param {string}           [data.firstName]
//  * @param {string}           [data.lastName]
//  * @param {User.AccessLevel} [data.accessLevel]
//  * @param {Object}           [data.settings]
//  * @param {Function}         cb
//  */
// UserSchema.methods.update = function updateMethod(data) {
//   return new Promise((resolve, reject) => {
//     let user = this;
//     let properties = [
//       "HUID",
//       "firstName",
//       "lastName",
//       "accessLevel",
//       "settings"
//     ];
//     for (let p of properties) {
//       if (data[p] !== undefined) {
//         user.set(p, data[p]);
//       }
//     }
//     user
//       .save()
//       .then(doc => {
//         resolve(doc);
//       })
//       .catch(error => reject({ error }));
//   });
// };
