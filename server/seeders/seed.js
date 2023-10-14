require('dotenv').config()
const { dbName } = require("../constant/constant");
const { hashPassword } = require("../helper/bcrypt");
const Products = require("../model/product");
const Users = require("../model/user");

const fs = require('fs');
const mongoose = require('mongoose');

// Connect to your MongoDB database
const mongoURI = process.env.MONGODB_URI + dbName;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function getDataAndSeed(fileName, model) {
    const rawData = fs.readFileSync(`./seeders/${fileName}.json`);
    const data = JSON.parse(rawData);

    await model.deleteMany({})
    await model.insertMany(data)
}

function getData(fileName) {
    const rawData = fs.readFileSync(`./seeders/${fileName}.json`);
    return JSON.parse(rawData);
}

async function seed(data, model) {
    await model.deleteMany({})
    await model.insertMany(data)
}

// Function to seed the database
async function seedDatabase() {
    try {
        const userData = [
            {
                email: "user@mail.com",
                password: hashPassword("12345678"),
                username: "user",
                firstname: "Joko",
                lastname: "Ardan",
                admin: false
            },
            {
                email: "user1@mail.com",
                password: hashPassword("12345678"),
                username: "user1",
                firstname: "Joko",
                lastname: "Har",
                admin: false
            },
            {
                email: "user2@mail.com",
                password: hashPassword("12345678"),
                username: "user2",
                firstname: "Joko",
                lastname: "Bayu",
                admin: false
            },
            {
                email: "admin@mail.com",
                password: hashPassword("12345678"),
                username: "Admin Ganteng",
                firstname: "juner",
                lastname: "aidy",
                admin: true
            },
        ]

        await seed(userData, Users)
        await getDataAndSeed('data', Products)

        console.log('seeding complete')
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
