import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/organizer-event.service';
import type { IEventFull, EventDetailContext } from '../types/organizer.type';

const MOBILE_BREAKPOINT = 768;

export function useEventDetail() {
  const { eventId } = useParams<{ eventId: string }>();

  // ── Event state ──
  const [event, setEvent] = useState<IEventFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Sidebar state ──
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive detection ──
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    if (mobile) setSidebarExpanded(false);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // ── Fetch event ──
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    const data = await getEventById(eventId);
    if (data) setEvent(data);
    else setError('Không tìm thấy sự kiện');
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const outletContext: EventDetailContext = { event, loading, refetchEvent: fetchEvent };

  return {
    eventId,
    event,
    loading,
    error,
    sidebarExpanded,
    setSidebarExpanded,
    isMobile,
    outletContext,
    fetchEvent,
  };
}
