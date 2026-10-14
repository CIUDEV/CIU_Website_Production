import AnnouncementTicker from "@frontend/components/AnnouncementTicker";
import { listActiveAnnouncements } from "@backend/http/announcements";

export default async function PublicAnnouncementTicker() {
  let messages: string[] = [];
  try {
    messages = (await listActiveAnnouncements()).map((item) => item.message).filter(Boolean);
  } catch {
    // The ticker can retry from the browser if SQL is still connecting.
  }
  return <AnnouncementTicker initialItems={messages} />;
}
