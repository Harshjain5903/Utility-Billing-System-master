require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/utility_billing_system";
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectToMongo = async (retryCount = 0) => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB Successfully");
    
    mongoose.connection.on('error', (error) => {
      console.error("MongoDB connection error:", error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });
    
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectToMongo(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error("❌ Max retries reached. Could not connect to MongoDB.");
      process.exit(1);
    }
  }
};

module.exports = connectToMongo;
