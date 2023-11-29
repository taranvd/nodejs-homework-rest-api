const express = require("express");
const router = express.Router();
const ContactsController = require("../../controllers/contacts");
const { isValidId, validateBody, authenticate } = require("../../middlewares");
const schemas = require("../../schemas/contacts");

router.get("/", authenticate, ContactsController.listContacts);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ContactsController.getContactById
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.contactsSchema),
  ContactsController.addContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.patchScheme),
  ContactsController.updateStatusContact
);

router.delete("/:contactId", isValidId, ContactsController.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.contactsSchema),
  ContactsController.updateContact
);

module.exports = router;
