import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import schemas
import './UserDetails.js';

dotenv.config({ path: '.env' });

const mongoUrl = process.env.mongoUrl || 'mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/NoidaFarms';

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Database connected for seeding");

        const User = mongoose.model("UserInfo");
        const AgentAndAdmin = mongoose.model("AgentAndAdmin");
        const Farmhouse = mongoose.model("FarmHouses");

        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create 1 Admin
        console.log("Seeding Admin...");
        await AgentAndAdmin.findOneAndUpdate(
            { email: 'admin@noidafarms.com' },
            {
                name: 'Super Admin',
                email: 'admin@noidafarms.com',
                phoneNumber: '0000000000',
                password: hashedPassword,
                isAdult: true,
                isActive: true,
                role: 'admin',
                isBanned: false,
                permissions: {
                    users: true, farmhouses: true, bookings: true, bookFarmhouse: true,
                    payment: true, analytics: true, addAgent: true, allAgents: true,
                    communicationMarketing: true, supportSecurity: true
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Create 3 Agents
        console.log("Seeding Agents...");
        const agents = [];
        for (let i = 1; i <= 3; i++) {
            const agent = await AgentAndAdmin.findOneAndUpdate(
                { email: `agent${i}@noidafarms.com` },
                {
                    name: `Agent ${i}`,
                    email: `agent${i}@noidafarms.com`,
                    phoneNumber: `100000000${i}`,
                    password: hashedPassword,
                    isAdult: true,
                    isActive: true,
                    role: 'agent',
                    isBanned: false,
                    permissions: {
                        users: false, farmhouses: false, bookings: true,
                        bookFarmhouse: true, payment: false, analytics: false,
                        addAgent: false, allAgents: false, communicationMarketing: false,
                        supportSecurity: false
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            agents.push(agent);
        }

        // Create 5 Users
        console.log("Seeding Users...");
        const users = [];
        for (let i = 1; i <= 5; i++) {
            const user = await User.findOneAndUpdate(
                { email: `user${i}@noidafarms.com` },
                {
                    name: `User ${i}`,
                    lastName: `Test`,
                    email: `user${i}@noidafarms.com`,
                    phoneNumber: `200000000${i}`,
                    password: hashedPassword,
                    gender: 'Male',
                    address: `User ${i} Address, City`,
                    dob: '2000-01-01',
                    isAdult: true,
                    isActive: true,
                    role: 'user',
                    isBanned: false,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            users.push(user);
        }

        // Create 10 Farmhouses
        console.log("Seeding Farmhouses...");
        for (let i = 1; i <= 10; i++) {
            // Assign farmhouses ownership randomly around the generated users
            await Farmhouse.findOneAndUpdate(
                { "description.title": `Premium Farmhouse ${i}` },
                {
                    userId: users[i % users.length]._id,
                    address: {
                        houseNumber: `${i}0${i}`,
                        areaName: 'Sector 150',
                        city: 'Noida',
                        state: 'UP',
                        pinCode: '201310',
                        country: 'India',
                        coordinates: {
                            latitude: 28.4 + (i * 0.01),
                            longitude: 77.4 + (i * 0.01)
                        }
                    },
                    basicDetails: {
                        guests: 10 + i,
                        bedrooms: 2 + (i % 3),
                        beds: 3 + (i % 4),
                        bathrooms: 2 + (i % 2)
                    },
                    amenities: ['Pool', 'WiFi', 'Kitchen', 'AC', 'TV', 'Free Parking', 'BBQ Grill'],
                    images: [{ uri: `https://via.placeholder.com/600x400.png?text=Farmhouse+${i}` }],
                    description: {
                        title: `Premium Farmhouse ${i}`,
                        body: `A very spacious and beautiful farmhouse perfect for parties and weekend getaways. Featuring top-notch amenities. Farmhouse number ${i}.`
                    },
                    pricing: [
                        { type: 'dayFare', fare: 5000 + (i * 500) },
                        { type: 'nightFare', fare: 6000 + (i * 500) },
                        { type: 'fullDayFare', fare: 10000 + (i * 1000) }
                    ],
                    status: 'completed',
                    approved: 'approved'
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log("Database seeding completed successfully!");
        console.log("Password for all generated accounts is: password123");

        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Database seeding error:", error);
        mongoose.disconnect();
        process.exit(1);
    }
};

seedDatabase();
