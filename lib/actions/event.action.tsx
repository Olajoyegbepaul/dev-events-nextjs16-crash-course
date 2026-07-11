import { Event } from '@/database/event.model';
import connectToDatabase from '@/lib/mongodb';

export const getSimilarEventsBySlug = async (slug: string) => {
  try{
    await connectToDatabase();
    const event = await Event.findOne({ slug });

    const similarEvents = await Event.find({ _id: { $ne: event?._id }, tags: { $in: event?.tags } }).lean();
    
    return similarEvents.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));
  }catch {
    return [];
  }
};