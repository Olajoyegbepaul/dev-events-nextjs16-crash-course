import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary";

import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());

    event.slug = (event.title as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Convert tags and agenda from string to array if they're comma-separated strings
    if (typeof event.tags === "string") {
      event.tags = JSON.parse(event.tags);
    }

    if (typeof event.agenda === "string") {
      event.agenda = JSON.parse(event.agenda);
    }

    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        {
          message: "Image is required",
        },
        {
          status: 400,
        }
      );
    }

    const tags = JSON.parse(formData.get('tags') as string);
    const agenda = JSON.parse(formData.get('agenda') as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({resource_type: "image", folder: "DevEvent"}, (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }).end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({...event, tags: tags, agenda: agenda});

    return NextResponse.json(
      {
        message: "Event Created Successfully",
        event: createdEvent,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events Fetched Successfully",
        events,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        message: "Event Fetching Failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

// a route that accepts a slug as input and returns the event details