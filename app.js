const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./Dbconnection');
const SignupRoute = require('./Route/SignupRoute');
const ProductRoute=require('./Route/ProductRoute')
const ImageRouter=require('./Route/ImageRoute')
const OrderRoute=require('./Route/order.route')
const VerifyRoute=require('./Route/VerifyRoute')
const cookieParser = require('cookie-parser');
const Razorpay=require('razorpay')
const PaymentRoute=require('./Route/Payment')
const MobileRoute=require('./Route/Mobile.route')
const webpush = require('web-push');

// Set your VAPID keys
const VAPID_PUBLIC_KEY = 'BFp-58WtaHUCd8NOkLLY8Jxv9YtwjCXIUJbyyrWhW46-o-YUvgLWtF-zD0wbti21Ik2JhDeKxp-SeuUKzatZLqo';
const VAPID_PRIVATE_KEY = 'Dhcz-OcB4G0SSayunXbc9vhEZY6pxNutNd0anCmc2mY';
const VAPID_SUBJECT = 'mailto:naitikraj12935@example.com';
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
dotenv.config();
const app = express();



app.use(cookieParser());
const corsOptions = {
  origin: 'https://verdant-shortbread-9c58f5.netlify.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept'],
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/', SignupRoute);
app.use('/',ProductRoute);
app.use('/',ImageRouter);
app.use('/',OrderRoute);
app.use('/',VerifyRoute);
app.use('/api',PaymentRoute);
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);

app.use('/',MobileRoute);
app.use('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log(subscription);

  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'This is a test push notification.',
});

// Send the push notification
webpush.sendNotification(subscription, payload)
    .then(response => {
        console.log('Push notification sent:', response);
    })
    .catch(error => {
        console.error('Error sending push notification:', error);
    });
  res.status(201).json({ message: 'Subscription received successfully' });
});


// Database Connection
connectToDatabase();

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started');
});


