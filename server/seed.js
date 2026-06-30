// Seed the database with demo data for PawConnect.
// Usage: node seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Animal = require('./Models/animal');
const User = require('./Models/User');
const Event = require('./Models/Event');
const Resource = require('./Models/Resource');
const Vet = require('./Models/vet');

const animals = [
  {
    name: 'Buddy', animalType: 'Dog', age: 3, breed: 'Golden Retriever', gender: 'Male',
    size: 'Large', color: 'Golden', adoptionFee: 150, adoptionStatus: 'Available',
    description: 'A friendly and energetic Golden Retriever who loves fetch and belly rubs.',
    temperament: ['Friendly', 'Energetic', 'Loyal'],
    medicalHistory: { vaccinated: true, neutered: true, healthIssues: '' },
    location: { shelter: 'Happy Tails Shelter', city: 'Austin', state: 'TX' },
  },
  {
    name: 'Whiskers', animalType: 'Cat', age: 2, breed: 'Persian', gender: 'Female',
    size: 'Small', color: 'White', adoptionFee: 90, adoptionStatus: 'Available',
    description: 'A calm and affectionate Persian cat who enjoys quiet afternoons by the window.',
    temperament: ['Calm', 'Affectionate'],
    medicalHistory: { vaccinated: true, neutered: true, healthIssues: '' },
    location: { shelter: 'Whisker Haven', city: 'Dallas', state: 'TX' },
  },
  {
    name: 'Tweety', animalType: 'Bird', age: 1, breed: 'Canary', gender: 'Female',
    size: 'Small', color: 'Yellow', adoptionFee: 40, adoptionStatus: 'Available',
    description: 'A cheerful canary with a beautiful song. Great companion for a sunny home.',
    temperament: ['Cheerful', 'Active'],
    medicalHistory: { vaccinated: false, neutered: false, healthIssues: '' },
    location: { shelter: 'Feathered Friends', city: 'Houston', state: 'TX' },
  },
  {
    name: 'Max', animalType: 'Dog', age: 5, breed: 'German Shepherd', gender: 'Male',
    size: 'Large', color: 'Black & Tan', adoptionFee: 175, adoptionStatus: 'Available',
    description: 'A smart and protective German Shepherd, well-trained and great with families.',
    temperament: ['Intelligent', 'Protective', 'Trainable'],
    medicalHistory: { vaccinated: true, neutered: true, healthIssues: '' },
    location: { shelter: 'Happy Tails Shelter', city: 'Austin', state: 'TX' },
  },
  {
    name: 'Luna', animalType: 'Cat', age: 1, breed: 'Siamese', gender: 'Female',
    size: 'Small', color: 'Cream', adoptionFee: 110, adoptionStatus: 'Available',
    description: 'A playful Siamese kitten full of curiosity and love.',
    temperament: ['Playful', 'Vocal', 'Curious'],
    medicalHistory: { vaccinated: true, neutered: false, healthIssues: '' },
    location: { shelter: 'Whisker Haven', city: 'Dallas', state: 'TX' },
  },
  {
    name: 'Coco', animalType: 'Rabbit', age: 2, breed: 'Holland Lop', gender: 'Female',
    size: 'Small', color: 'Brown', adoptionFee: 55, adoptionStatus: 'Available',
    description: 'A gentle Holland Lop rabbit who loves leafy greens and gentle handling.',
    temperament: ['Gentle', 'Quiet'],
    medicalHistory: { vaccinated: true, neutered: true, healthIssues: '' },
    location: { shelter: 'Small Paws Rescue', city: 'San Antonio', state: 'TX' },
  },
];

const vets = [
  { name: 'Dr. Sarah Lee', email: 'sarah@pawcare.com', phone: '512-555-0101', address: '100 Main St, Austin, TX' },
  { name: 'Dr. James Patel', email: 'james@vetwell.com', phone: '214-555-0144', address: '55 Oak Ave, Dallas, TX' },
];

async function seed() {
  await mongoose.connect(process.env.DB);
  console.log('Connected to DB for seeding');

  // A shelter user to own events / resources
  let shelter = await User.findOne({ email: 'shelter@pawconnect.com' });
  if (!shelter) {
    shelter = await User.create({
      firstName: 'Happy', lastName: 'Tails', email: 'shelter@pawconnect.com',
      password: 'shelter123', phone: '512-555-0000', role: 'shelter',
    });
    console.log('Created shelter user: shelter@pawconnect.com / shelter123');
  }

  await Animal.deleteMany({});
  await Animal.insertMany(animals);
  console.log(`Seeded ${animals.length} animals`);

  await Vet.deleteMany({});
  await Vet.insertMany(vets);
  console.log(`Seeded ${vets.length} vets`);

  await Event.deleteMany({});
  await Event.insertMany([
    {
      title: 'Spring Adoption Drive', description: 'Meet dozens of adoptable pets looking for a forever home!',
      eventType: 'Adoption Drive', date: new Date(Date.now() + 7 * 864e5),
      location: { venue: 'City Park', address: '200 Park Rd', city: 'Austin', state: 'TX' },
      organizer: shelter._id, capacity: 200,
    },
    {
      title: 'Pet Care Workshop', description: 'Learn the basics of nutrition, grooming, and first aid for your pets.',
      eventType: 'Workshop', date: new Date(Date.now() + 14 * 864e5),
      location: { venue: 'Community Center', address: '12 Elm St', city: 'Dallas', state: 'TX' },
      organizer: shelter._id, capacity: 50,
    },
  ]);
  console.log('Seeded 2 events');

  await Resource.deleteMany({});
  await Resource.insertMany([
    {
      name: 'PawCare Veterinary Clinic', type: 'Veterinary',
      description: 'Full-service veterinary clinic offering checkups, surgery, and emergency care.',
      contact: { phone: '512-555-0101', email: 'info@pawcare.com', website: 'https://pawcare.com' },
      address: { street: '100 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
      hours: 'Mon-Sat 8am-6pm', services: ['Checkups', 'Surgery', 'Emergency'],
      submittedBy: shelter._id, verified: true,
    },
    {
      name: 'Happy Tails Shelter', type: 'Shelter',
      description: 'A no-kill animal shelter dedicated to rehoming dogs, cats, and small animals.',
      contact: { phone: '512-555-0000', email: 'hello@happytails.org', website: 'https://happytails.org' },
      address: { street: '200 Park Rd', city: 'Austin', state: 'TX', zipCode: '78704' },
      hours: 'Daily 10am-5pm', services: ['Adoption', 'Fostering', 'Volunteering'],
      submittedBy: shelter._id, verified: true,
    },
  ]);
  console.log('Seeded 2 resources');

  console.log('Done seeding.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
