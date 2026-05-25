// Import required packages
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env file

// 1. Installing and setting up Mongoose
// Connect to the database using the MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Database connected successfully!"))
.catch(err => console.error("Database connection error: ", err));

// 2. Create a person prototype (Schema)
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // name is required
  age: Number,
  favoriteFoods: [String] // Array of strings
});

// Create the Model from the Schema
const Person = mongoose.model('Person', personSchema);

// 3. Create and Save a Record of a Model
const createAndSavePerson = (done) => {
  // Create an instance of the Person model
  const johnDoe = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["Pizza", "Burger"]
  });

  // Save the document to the database
  johnDoe.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// 4. Create Many Records with model.create()
const createManyPeople = (arrayOfPeople, done) => {
  // Pass the array directly to Model.create()
  Person.create(arrayOfPeople, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// 5. Use model.find() to Search Your Database
const findPeopleByName = (personName, done) => {
  // Find all people with the given name
  Person.find({ name: personName }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// 6. Use model.findOne() to Return a Single Matching Document
const findOneByFood = (food, done) => {
  // Find one person who has the specified food in favoriteFoods
  Person.findOne({ favoriteFoods: food }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// 7. Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
  // Find a person matching the unique _id
  Person.findById(personId, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// 8. Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
  // Step 1: Find the person by ID
  Person.findById(personId, function(err, person) {
    if (err) return console.error(err);
    
    // Step 2: Add "hamburger" to their favorite foods array
    person.favoriteFoods.push("hamburger");
    
    // Step 3: Save the updated document
    person.save(function(err, updatedPerson) {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};

// 9. Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  // Find by name, set age to 20, and return the updated document ({ new: true })
  Person.findOneAndUpdate(
    { name: personName }, 
    { age: ageToSet }, 
    { new: true }, 
    function(err, updatedDoc) {
      if (err) return console.error(err);
      done(null, updatedDoc);
    }
  );
};

// 10. Delete One Document Using model.findByIdAndRemove
// Note: findByIdAndDelete is preferred in newer Mongoose versions, but we use the requested logic
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err, removedDoc) {
    if (err) return console.error(err);
    done(null, removedDoc);
  });
};

// 11. Delete Many Documents with model.remove()
// Note: deleteMany is preferred in newer Mongoose, but we match the instruction's model.remove()
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, function(err, response) {
    if (err) return console.error(err);
    done(null, response);
  });
};

// 12. Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
  const foodToSearch = "burritos";

  Person.find({ favoriteFoods: foodToSearch }) // Find people who like burritos
    .sort({ name: 1 })                         // Sort them by name (1 for alphabetical/ascending)
    .limit(2)                                  // Limit the results to two documents
    .select({ age: 0 })                        // Hide their age (0 means exclude)
    .exec(function(err, data) {                // Execute the query chain
      if (err) return console.error(err);
      done(null, data);
    });
};

// Export functions if needed for testing suites
module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};
