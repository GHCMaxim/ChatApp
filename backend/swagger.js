const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Chat App API",
    description: "API Documentation",
    version: "0.1.0",
  },
  host: "api.minim.lol",
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/routes/attachmentRoutes.ts",
  "./src/routes/authRoutes.ts",
  "./src/routes/conversationRoutes.ts",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
