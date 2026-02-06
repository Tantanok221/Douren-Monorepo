import React from 'react';
import { Header } from './Header';
import { Banner } from './Banner';
import { Event } from '../types';
interface LayoutProps {
  children: React.ReactNode;
  events: Event[];
  selectedEvent: Event;
  onEventChange: (event: Event) => void;
  isDark: boolean;
  onDarkModeToggle: () => void;
}
export function Layout({
  children,
  events,
  selectedEvent,
  onEventChange,
  isDark,
  onDarkModeToggle
}: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-archive-bg text-archive-text px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Wide Banner Image */}
        <Banner
          imageUrl="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"
          alt="同人展會活動"
          overlay={{
            title: 'FF44 台北 2024',
            subtitle: '2月3-4日 • 台北世貿一館 • 500+ 創作者'
          }} />


        <Header
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={onEventChange}
          isDark={isDark}
          onDarkModeToggle={onDarkModeToggle} />


        <main>{children}</main>

        <footer className="mt-20 py-8 border-t border-archive-border flex flex-col md:flex-row justify-between items-center text-xs font-sans text-archive-text/40 gap-4 md:gap-0">
          <div>© 2024 同人檔案館 • {selectedEvent.code} 活動</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-archive-text transition-colors">
              關於
            </a>
            <a href="#" className="hover:text-archive-text transition-colors">
              條款
            </a>
            <a href="#" className="hover:text-archive-text transition-colors">
              隱私
            </a>
          </div>
        </footer>
      </div>
    </div>);

}