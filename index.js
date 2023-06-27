const MongoClient = require('mongodb').MongoClient;
const prompt = require("prompt-sync")();
// Connection URL and database name
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'blogging_platform';

// Function to connect to MongoDB
async function connection() {
  console.log('update');
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB server
    console.log('checking');
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the database
    const db = client.db(dbName);

    // Call the functions to perform operations
    await createUser(db);
    await createBlogPost(db);
    await displayBlogPosts(db);
    await updateOrDeleteBlogPost(db);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Function to insert a user document into the "Users" collection
async function createUser(db) {
  const collection = db.collection('Users');

  // Prompt the user for input
  
  const username = prompt('Enter your username:');
  const email = prompt('Enter your email:');
  const password = prompt('Enter your password:');

  // Create the user document
  const user = {
    username: username,
    email: email,
    password: password
  };

  // Insert the user document into the collection
  await collection.insertOne(user);
  console.log('User document inserted');
}

// Function to insert a blog post document into the "Posts" collection
async function createBlogPost(db) {
  const collection = db.collection('Posts');

  // Prompt the user for input
  const title = prompt('Enter the title of the blog post:');
  const content = prompt('Enter the content of the blog post:');
  const author = prompt('Enter your name (author):');
  const creationDate = new Date();

  // Create the blog post document
  const blogPost = {
    title: title,
    content: content,
    author: author,
    creationDate: creationDate
  };

  // Insert the blog post document into the collection
  await collection.insertOne(blogPost);
  console.log('Blog post document inserted');
}

// Function to retrieve and display all blog posts from the "Posts" collection
async function displayBlogPosts(db) {
  const collection = db.collection('Posts');

  // Retrieve all blog posts and sort by creation date in descending order
  const blogPosts = await collection.find().sort({ creationDate: -1 }).toArray();

  // Display the blog posts
  console.log('Blog Posts:');
  blogPosts.forEach(post => {
    console.log('Title:', post.title);
    console.log('Author:', post.author);
    console.log('Creation Date:', post.creationDate);
    console.log('-------------------------');
  });
}

// Function to update or delete a blog post from the "Posts" collection
async function updateOrDeleteBlogPost(db) {
  const collection = db.collection('Posts');

  // Prompt the user for input
  const option = prompt('Enter "u" to update or "d" to delete a blog post:');
  
  if (option === 'u') {
    // Update a blog post
    const blogPostTitle = prompt('Enter the title of the blog post to update:');
    const newTitle = prompt('Enter the new title (or press Enter to keep the same title):');
    const newContent = prompt('Enter the new content (or press Enter to keep the same content):');

    const updateFields = {};

    if (newTitle !== '') {
      updateFields.title = newTitle
    }
    await collection.updateOne({ title: blogPostTitle }, { $set: updateFields });
    console.log('Blog post updated');
  } else if (option === 'd') {
    // Delete a blog post
    const blogPostTitle = prompt('Enter the title of the blog post to delete:');

    await collection.deleteOne({ title: blogPostTitle });
    console.log('Blog post deleted');
  } else {
    console.log('Invalid option');
  }
}
connection();
