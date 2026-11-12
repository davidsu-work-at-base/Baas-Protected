import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const CONNECTOR_ID = '6af5aaf42a4e342b97c28751';
const DAYS_AHEAD = 30;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let connection = null;
    try {
      connection = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);
    } catch (e) {
      connection = null;
    }

    const accessToken = connection && connection.accessToken;
    if (!accessToken) {
      return Response.json({ connected: false, events: [] });
    }

    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + DAYS_AHEAD * 24 * 60 * 60 * 1000).toISOString();
    const url =
      'https://www.googleapis.com/calendar/v3/calendars/primary/events' +
      '?singleEvents=true&orderBy=startTime&maxResults=100' +
      `&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = (data && data.error && data.error.message) || 'Google Calendar request failed';
      return Response.json({ connected: true, events: [], error: message }, { status: 502 });
    }

    const events = (data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary || '(No title)',
      start: (event.start && (event.start.dateTime || event.start.date)) || null,
      end: (event.end && (event.end.dateTime || event.end.date)) || null,
      allDay: Boolean(event.start && event.start.date),
      location: event.location || '',
      description: event.description || '',
      htmlLink: event.htmlLink || '',
    }));

    return Response.json({
      connected: true,
      events,
      timeZone: data.timeZone || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}