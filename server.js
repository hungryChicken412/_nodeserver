// server.js

import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const vapidKeys = {
	publicKey: process.env.VAPID_PUBLIC_KEY,
	privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
	"test@gmail.com",
	"BNuOlScs8nnNTL6kMMm8B1Dfj11Yk9JcP_xfssqT0Qny5FIphBq-Wl-GiQ0mjchosCZt4kIvJjZiL07IZsywA7w", // public
	"GnHn5J3BvrDFRL6KM71RkdJYTdpQY1u0NzBzGnRlU4k" //private
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
	const subscription = req.body;
	subscriptions.push(subscription);

	res.status(201).json({ status: "success" });
});

app.post("/send-notification", (req, res) => {
	const notificationPayload = {
		title: "New Notification",
		body: "This is a new notification",
		icon: "https://some-image-url.jpg",
		data: {
			url: "https://example.com",
		},
	};

	Promise.all(
		subscriptions.map((subscription) =>
			webpush.sendNotification(
				subscription,
				JSON.stringify(notificationPayload)
			)
		)
	)
		.then(() =>
			res.status(200).json({ message: "Notification sent successfully." })
		)
		.catch((err) => {
			console.error("Error sending notification");
			res.sendStatus(500);
		});
});
app.get("/test", (req, res) => {
	res.send("Hello World");
});

app.listen(4000, () => {
	console.log("Server started on port 4000");
});
