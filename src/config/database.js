const { Sequelize } = require("sequelize");

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,   // Database name
  process.env.POSTGRES_USER,       // Username
  process.env.POSTGRES_PASSWORD,   // Password
  {
    host: process.env.POSTGRES_HOST,  // Host
    port: process.env.POSTGRES_PORT,  // Port (optional)
    dialect: "postgres",  
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // You may need this option depending on your setup
      }
    },
    logging: false             
  }
);

async function initializeDatabase() {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    // console.log("Connection has been established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true }); // Use `alter: true` to update the tables without dropping them
    // console.log("All models were synchronized successfully.");
  } catch (error) {
    // Log any connection errors
    console.error("Unable to connect to the database:", error);
  }
}

// Call the function to initialize the database
initializeDatabase();

// Export the Sequelize instance for use in other parts of the application
module.exports = sequelize;
