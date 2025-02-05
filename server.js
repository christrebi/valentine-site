const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)
app.use(bodyParser.json());

// Email configuration (replace with your email details)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or another email provider
    auth: {
        user: 'valsdaytest14@gmail.com', // Replace with your email
        pass: 'wodsifuistwenmou'  // Replace with your email password
    }
});

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { response } = req.body; // Get the response from the request body

    // Save the response to a file
    fs.appendFile('responses.txt', `Response: ${response}\n`, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
        console.log('Response saved successfully.');
    });

    // Customize email content based on her response
    let emailSubject, emailText;

    if (response === 'Yes 😊') {
        emailSubject = 'Congratulations!!';
        emailText = `Congratulations!!, Cornelia accepted to be your valentine 🎉🎉`;
    } else if (response === 'No 😠') {
        emailSubject = 'Oh No!';
        emailText = `Cornelia declined your invitation with a "No 😠". Better luck next time! 😢`;
    } else {
        emailSubject = 'Valentine Response from Cornelia';
        emailText = `Cornelia's response: ${response}`;
    }

    // Send email notification
    const mailOptions = {
        from: 'valsdaytest14@gmail.com', // Replace with your email
        to: 'valsdaytest14@gmail.com',  // Replace with your email
        subject: emailSubject,
        text: emailText
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Response received!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
