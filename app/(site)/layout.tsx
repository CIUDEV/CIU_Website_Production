import Footer from "@frontend/components/Footer";
import Navbar from "@frontend/components/Navbar";
import PublicAnnouncementTicker from "@frontend/components/PublicAnnouncementTicker";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar ticker={<PublicAnnouncementTicker />} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
