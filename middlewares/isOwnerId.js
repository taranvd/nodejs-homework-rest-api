const { HttpError } = require("../helpers");
const Contacts = require("../models/contacts");

const isOwnerId = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);

  if (contact.owner.toString() !== req.user.id) {
    next(HttpError(404));
  }

  next();
};

module.exports = isOwnerId;
