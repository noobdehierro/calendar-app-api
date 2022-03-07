const { request } = require("express");
const { response } = require("express");
const Event = require("../DB/models/Event");

const getEvents = async (req = request, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.status(200).json({ ok: true, eventos: events });
};

const createEvent = async (req = request, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;

    const eventSaving = await event.save();
    res.status(200).json({ ok: true, event: eventSaving });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event does not exist for that id",
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have privileges to edit this event",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const evtUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      evento: evtUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event does not exist for that id",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have privilege to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventId);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
