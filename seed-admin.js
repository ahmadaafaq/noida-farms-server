import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoUrl = 'mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/NoidaFarms';

async function seedAdmin() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Connected to MongoDB");

        // Define temporary schema to push data directly to the collection
        const AdminSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String,
            isActive: Boolean
        }, { collection: "AgentAndAdmin" });

        const AgentAndAdmin = mongoose.model("AgentAndAdmin", AdminSchema);

        // Check if admin already exists
        const existingAdmin = await AgentAndAdmin.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists! You can log in with email: admin@gmail.com");
            process.exit(0);
        }

        // Hash the default password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create the admin user
        await AgentAndAdmin.create({
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            isActive: true
        });

        console.log("🎉 Admin user created successfully!");
        console.log("👉 Email: admin@gmail.com");
        console.log("👉 Password: Admin@123");

    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

seedAdmin();
