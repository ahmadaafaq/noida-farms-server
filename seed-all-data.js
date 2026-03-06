import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';

const mongoUrl = 'mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/NoidaFarms';

async function seedData() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Connected to MongoDB");

        // Clear existing data (optional, but good for clean seeding)
        // Be careful with this in production! We are assuming this is a fresh test DB.
        mongoose.connection.db.dropDatabase();
        console.log("🧹 Cleared existing database");

        // ==========================================
        // 1. AgentAndAdmin Collection
        // ==========================================
        const AdminSchema = new mongoose.Schema({
            name: String, email: String, password: String, role: String, isActive: Boolean,
            permissions: Object
        }, { collection: "AgentAndAdmin" });
        const AgentAndAdmin = mongoose.model("AgentAndAdmin", AdminSchema);

        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const adminUser = await AgentAndAdmin.create({
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            isActive: true,
            permissions: { users: true, farmhouses: true, bookings: true, payment: true, analytics: true }
        });
        console.log("🌱 Seeded Admin");

        // ==========================================
        // 2. UserInfo Collection
        // ==========================================
        const UserSchema = new mongoose.Schema({
            name: String, lastName: String, email: String, phoneNumber: String, password: String,
            role: String,
            isActive: Boolean, isAdult: Boolean
        }, { collection: "UserInfo" });
        const UserInfo = mongoose.model("UserInfo", UserSchema);

        const userHashedPassword = await bcrypt.hash('User@123', 10);
        const user1 = await UserInfo.create({
            name: "John", lastName: "Doe", email: "user@example.com", phoneNumber: "9876543210",
            password: userHashedPassword, role: "user", isActive: true, isAdult: true
        });
        console.log("🌱 Seeded User");

        // ==========================================
        // 3. FarmHouses Collection
        // ==========================================
        const FarmhouseSchema = new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            address: Object, basicDetails: Object, amenities: [String], images: [Object],
            description: Object, pricing: [Object], status: String, approved: String
        }, { collection: "FarmHouses" });
        const FarmHouses = mongoose.model("FarmHouses", FarmhouseSchema);

        const farmhouse1 = await FarmHouses.create({
            userId: adminUser._id, // Assigning admin as owner for simplicity
            address: {
                houseNumber: "123", areaName: "Sector 135", city: "Noida", state: "UP", pinCode: "201304", country: "India",
                coordinates: { latitude: 28.5355, longitude: 77.3910 }
            },
            basicDetails: { guests: 10, bedrooms: 3, beds: 4, bathrooms: 3 },
            amenities: ["Pool", "WiFi", "BBQ Grill", "Party Lawn"],
            images: [{ uri: "https://example.com/farm1.jpg" }],
            description: { title: "Luxury Pool Villa", body: "A beautiful farmhouse for weekend getaways." },
            pricing: [
                { type: "dayFare", fare: 10000 },
                { type: "nightFare", fare: 12000 },
                { type: "fullDayFare", fare: 20000 }
            ],
            status: "completed",
            approved: "approved"
        });
        console.log("🌱 Seeded Farmhouse");

        // ==========================================
        // 4. Order Collection
        // ==========================================
        const OrderSchema = new mongoose.Schema({
            user_id: mongoose.Schema.Types.ObjectId,
            farmhouse_id: mongoose.Schema.Types.ObjectId,
            farmhouse_name: String, UserName: String, PhoneNumber: String, userEmail: String,
            location: String, price_per_night: Number, total_price: Number,
            check_in_date: Date, BookFor: String, number_of_guests: Number,
            booking_status: String, payment: Object
        }, { collection: "Order" });
        const Order = mongoose.model("Order", OrderSchema);

        const dateTomorrow = new Date();
        dateTomorrow.setDate(dateTomorrow.getDate() + 1);

        const order1 = await Order.create({
            user_id: user1._id,
            farmhouse_id: farmhouse1._id,
            farmhouse_name: "Luxury Pool Villa",
            UserName: "John Doe",
            PhoneNumber: "9876543210",
            userEmail: "user@example.com",
            location: "Noida Sector 135",
            price_per_night: 12000,
            total_price: 12000,
            check_in_date: dateTomorrow,
            BookFor: "nightFare",
            number_of_guests: 6,
            booking_status: "Confirmed",
            payment: {
                razorpay_payment_id: "pay_xyz123",
                status: "Success",
                amount_paid: 12000,
                payment_date: new Date()
            }
        });
        console.log("🌱 Seeded Order");

        // ==========================================
        // 5. Bank Details Collection
        // ==========================================
        const BankSchema = new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            bankName: String, accountName: String, accountNumber: String, IfscCodeNumber: String
        }, { collection: "Bank_Details" });
        const BankDetails = mongoose.model("Bank_Details", BankSchema);

        await BankDetails.create({
            userId: user1._id,
            bankName: "HDFC Bank",
            accountName: "John Doe",
            accountNumber: "123456789012",
            IfscCodeNumber: "HDFC0001234"
        });
        console.log("🌱 Seeded Bank Details");

        // ==========================================
        // 6. Transactions Collection
        // ==========================================
        const TransactionSchema = new mongoose.Schema({
            order: mongoose.Schema.Types.ObjectId, user: mongoose.Schema.Types.ObjectId,
            razorpay_payment_id: String, razorpay_order_id: String, amount: Number, status: String
        }, { collection: "Transactions" });
        const Transactions = mongoose.model("Transactions", TransactionSchema);

        await Transactions.create({
            order: order1._id,
            user: user1._id,
            razorpay_payment_id: "pay_xyz123",
            razorpay_order_id: "order_abc789",
            amount: 12000,
            status: "captured"
        });
        console.log("🌱 Seeded Transaction");

        // ==========================================
        // 7. LegalCompliance Collection
        // ==========================================
        const LegalSchema = new mongoose.Schema({
            title: String, content: String
        }, { collection: "LegalCompliance" });
        const LegalCompliance = mongoose.model("LegalCompliance", LegalSchema);

        await LegalCompliance.create({
            title: "Terms and Conditions",
            content: "These are the terms and conditions for booking a farmhouse..."
        });
        console.log("🌱 Seeded Legal Compliance");

        console.log("\n🎉 All dummy data seeded successfully!");

    } catch (error) {
        console.error("❌ Error seeding data:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

seedData();
