"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = getUserDashboard;
exports.updateUserProfile = updateUserProfile;
const userRepository_1 = require("../repositories/userRepository");
async function getUserDashboard(id) {
    const user = await (0, userRepository_1.findUserById)(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
async function updateUserProfile(userIdFromToken, paramId, fields) {
    if (userIdFromToken !== paramId) {
        throw new Error("Forbidden: Cannot edit other user");
    }
    const updateFields = { ...fields };
    const updatedUser = await (0, userRepository_1.updateUser)(paramId, updateFields);
    if (!updatedUser) {
        throw new Error("No fields to update");
    }
    return updatedUser;
}
