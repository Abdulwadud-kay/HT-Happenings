import React from 'react';

export const parseText = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

  const parts = text.split(/(\s+)/);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
    } else if (part.match(emailRegex)) {
      return <a key={index} href={`mailto:${part}`}>{part}</a>;
    }
    return part;
  });
};
