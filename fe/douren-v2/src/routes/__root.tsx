import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RouteSeoMeta } from "@/components/seo/RouteSeoMeta";
import { useDarkMode } from "@/hooks/useDarkMode";
import { trpc } from "@/helper/trpc";
import { toEventViewModel } from "@/data/adapters";
import type { EventViewModel } from "@/types/models";

const SHOW_BANNER = false;

const RootLayout = () => {
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isBookmarks = pathname.endsWith("/bookmarks");
  const eventName = pathname.startsWith("/events/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";

  const eventsQuery = trpc.eventArtist.getAllEvent.useQuery();
  const events = useMemo<EventViewModel[]>(
    () => eventsQuery.data?.map(toEventViewModel) ?? [],
    [eventsQuery.data],
  );
  const selectedEvent =
    events.find((event) => event.name === eventName) ?? events[0];

  const handleEventChange = (event: EventViewModel) => {
    navigate({
      to: isBookmarks ? "/events/$eventName/bookmarks" : "/events/$eventName",
      params: { eventName: event.name },
    });
  };

  return (
    <Layout.Root>
      <RouteSeoMeta />
      <BreadcrumbJsonLd />
      {SHOW_BANNER ? (
        <Layout.Banner
          imageUrl="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"
          alt="同人展會活動"
          overlay={{
            title: selectedEvent?.name ?? "活動",
            subtitle: selectedEvent
              ? `活動檔案 • ${selectedEvent.code}`
              : "創作者名錄",
          }}
        />
      ) : null}
      <Layout.Header
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={handleEventChange}
        isDark={isDark}
        onDarkModeToggle={toggle}
      />
      <main>
        <Outlet />
      </main>
      <Layout.Footer eventCode={selectedEvent?.code} />
    </Layout.Root>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
