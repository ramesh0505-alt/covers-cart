import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events & Drops Management</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Event</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Event Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Schedule</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {events.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No events found.</td></tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4 font-medium">{event.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{event.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <div>{new Date(event.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-500 text-xs">to {new Date(event.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${event.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {event.active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4648d4] font-medium text-sm mr-4">Edit</button>
                    <button className="text-red-500 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
