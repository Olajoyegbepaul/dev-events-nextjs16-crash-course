import mongoose, { Schema, model, models, type Document, type Types } from "mongoose";

import type { IEvent } from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Please enter a valid email address",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Ensure the referenced event exists before the booking is saved.
bookingSchema.pre("save", async function (this: mongoose.Document & IBooking) {
  if (!this.isModified("eventId")) {
    return;
  }

  const EventModel = mongoose.model<IEvent>("Event");
  const event = await EventModel.findById(this.eventId).lean<IEvent | null>().exec();

  if (!event) {
    throw new Error("Referenced event does not exist.");
  }
});

export const Booking =
  (models.Booking as mongoose.Model<IBooking> | undefined) || model<IBooking>("Booking", bookingSchema);
