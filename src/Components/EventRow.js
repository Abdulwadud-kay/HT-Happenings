import React, { useRef } from 'react';
import EventDraft from './EventDraft';
import './EventRow.css';

const EventRow = ({ monthYear, events, onEdit, onDelete, onSendEmails }) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [year, month] = monthYear.split('-');
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  console.log('EventRow events:', events); // Debugging log

  return (
    <div className="event-row">
      <h3 className="month-header">{`${monthName} ${year}`}</h3>
      <div className="event-carousel">
        <button className="scroll-button left" onClick={() => handleScroll('left')}>&lt;</button>
        <div className="event-list" ref={scrollRef}>
          {events.map((event) => (
            <EventDraft
              key={event.id}
              event={event}
              isMyEventsPage={true}
              onEdit={onEdit}
              onDelete={onDelete}
              onSendEmails={onSendEmails}
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={() => handleScroll('right')}>&gt;</button>
      </div>
    </div>
  );
};

export default EventRow;
