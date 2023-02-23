const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const passwordFeature = require("@admin-bro/passwords");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],

  resources: [
    {
      resource: User,
      options: {
        properties: { encrypted: { isVisible: false } },
      },
      features: [
        passwordFeature({
          // PasswordsOptions
          properties: {
            // to this field will save the hashed password
            encryptedPassword: "password",
          },
          hash: (password) => Bcrypt.hash(password, 10),
        }),
      ],
    },
    {
      resource: Category,
    },
    {
      resource: Product,
    },
  ],

  rootPath: "/admin",
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "mypassword",
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || "admin-bro",
  cookiePassword: process.env.ADMIN_COOKIE_NAME || "P@ssw0rd",
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
});

module.exports = router;
