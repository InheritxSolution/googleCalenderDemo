const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");

// Provide the required configuration
var googleCredentials = require("../../config/google-credentials");
const calendarId = process.env.CALENDAR_ID;
// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  googleCredentials.client_email,
  null,
  googleCredentials.private_key,
  SCOPES
);

exports.get = async (req, res) => {
  res.status(200).json({ status: 1, msg: "GET Method" });
};

exports.create = async (req, res) => {
  try {
    let dateTimeStart = "2020-01-01T00:00:00.000Z";
    let dateTimeEnd = "2022-01-01T00:00:00.000Z";
    let responseList = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Asia/Kolkata",
    });
    let items = responseList["data"]["items"];
    let curStartTime = new Date(req.body.meeting_start_time).getTime();
    let curEndTime = new Date(req.body.meeting_end_time).getTime();
    let isValid = true;
    if (items.length > 0) {
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        let eStartTime = new Date(element.start.dateTime).getTime();
        let eEndTime = new Date(element.end.dateTime).getTime();
        if (
          (curStartTime >= eStartTime && curStartTime <= eEndTime) ||
          (curEndTime >= eStartTime && curEndTime <= eEndTime) ||
          (dateTimeStart <= eStartTime && curEndTime >= eEndTime)
        ) {
          return res.status(200).json({
            status: 0,
            msg: "Event Conflict with existing calendar event",
          });
        }
      }
    }
    if (isValid) {
      let event = {
        summary: req.body.event_title,
        description: req.body.meeting,
        start: {
          dateTime: req.body.meeting_start_time,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: req.body.meeting_end_time,
          timeZone: "Asia/Kolkata",
        },
      };

      //for the get event between two date
      let response = await calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event,
      });
      if (response["status"] == 200 && response["statusText"] === "OK") {
        res.status(200).json({ status: 1, msg: "Add Event Success" });
      } else {
        res.status(200).json({ status: 0, msg: "Add Event Fail" });
      }
    }
  } catch (e) {
    res.status(200).json({ status: 0, msg: "catch  error", data: e.message });
  }
};

exports.getList = async (req, res) => {
  try {
    let dateTimeStart = "2020-01-01T00:00:00.000Z";
    let dateTimeEnd = "2022-01-01T00:00:00.000Z";
    let response = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Asia/Kolkata",
    });
    let items = response["data"]["items"];
    if (items.length <= 0) {
      return res
        .status(200)
        .json({ status: 1, msg: "No event in Your calendar", data: items });
    } else {
      return res.status(200).json({
        status: 1,
        msg: `${items.length} Event Found`,
        data: items,
      });
    }
  } catch (e) {
    return res
      .status(200)
      .json({ status: 0, msg: "catch error", data: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const eventId = req.params.id;
    let response = await calendar.events.delete({
      auth: auth,
      calendarId: calendarId,
      eventId: eventId,
    });
    res
      .status(200)
      .json({ status: 1, msg: `event deleted successfully`, data: response });
  } catch (e) {
    res.status(200).json({ status: 0, msg: "catch  error", data: e.message });
  }
};
