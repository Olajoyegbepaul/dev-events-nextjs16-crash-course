import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Title cannot be empty",
      },
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Description cannot be empty",
      },
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Overview cannot be empty",
      },
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Image cannot be empty",
      },
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Venue cannot be empty",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Location cannot be empty",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Date cannot be empty",
      },
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Time cannot be empty",
      },
    },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: [true, "Mode is required"],
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Audience cannot be empty",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Organizer cannot be empty",
      },
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item",
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value.trim();
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTime(value: string): string {
  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]m)?$/i);

  if (!match) {
    return trimmedValue.toUpperCase();
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = match[2] ?? "00";
  const period = match[3]?.toUpperCase() ?? (hours >= 12 ? "PM" : "AM");
  const normalizedHours = hours % 12 || 12;

  return `${String(normalizedHours).padStart(2, "0")}:${minutes} ${period}`;
}

eventSchema.pre("save", async function (this: mongoose.Document & IEvent) {
  // Generate a URL-friendly slug from the title when it is first set or changed.
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize the event date and time to keep storage consistent.
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }

  // Normalize tags: convert string to array and trim each tag
  if (this.isModified("tags")) {
    if (typeof this.tags === "string") {
      this.tags = (this.tags as unknown as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } else if (Array.isArray(this.tags)) {
      this.tags = this.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }
  }

  // Normalize agenda: convert string to array and trim each item
  if (this.isModified("agenda")) {
    if (typeof this.agenda === "string") {
      this.agenda = (this.agenda as unknown as string)
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    } else if (Array.isArray(this.agenda)) {
      this.agenda = this.agenda
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }
});

export const Event =
  (models.Event as mongoose.Model<IEvent> | undefined) || model<IEvent>("Event", eventSchema);
