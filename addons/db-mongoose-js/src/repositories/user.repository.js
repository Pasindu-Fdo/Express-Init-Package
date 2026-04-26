import User from "../models/user.model.js";

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByResetPasswordToken(token) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async create(data) {
    const user = await User.create(data);
    return Array.isArray(user) ? user[0] : user;
  }

  async findById(id) {
    return User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new UserRepository();
