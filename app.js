'use strict';

const express = require("express");
const path = require("path");
const PubSub = require("./services/pubsub.service");
const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(express.static(path.join(__dirname, 'public')))

// initlize pub/sub
new PubSub();

app.get('/api/send-notification', async (req, res) => {
    try {
        const { msg } = req.query;
        global.emitEvents({ msg })
        return res.status(200).send("Event sent.");
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

module.exports = app;