require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors'); // Fixed typo
import { errorHandler } from "./_middleware/error-handler";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Use the correctly named cors variable

// API routes
app.use('/users', require('./users/users.controller'));

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));