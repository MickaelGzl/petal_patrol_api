import { Comment } from "../db/server.js";

export const findCommentByUserId = (userId) => {
  return Comment.findAll({ where: { userId } });
};

export const createComment = async (message, rapportId, userId) => {
  const newComment = await Comment.create({ message });
  newComment.addRapport(rapportId);
  newComment.addUser(userId);
  return newComment.save();
};

export const findCommentById = (id) => {
  return Comment.findByPk(id);
};

export const updateComment = (comment, newValues) => {
  return comment.update(newValues);
};

export const deleteComment = (id) => {
  return Comment.destroy({ where: { id } });
};
