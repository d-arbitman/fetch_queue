import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './Log.css';
import { formatDate } from '../../util/date.js';

const Log = () => {
  const logData = useSelector((state) => state.log),
    divEndRef = useRef(null),
    levels = { debug: 0, info: 1, error: 2 };

  useEffect(() => {
    if (divEndRef && divEndRef.current && divEndRef.current.scrollIntoView) {
      divEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    logData.entries ? <div className="log"> {
      logData.entries
        .filter(item => levels[item.level] >= levels[logData.level])
        .map((item, i) => <div key={i} className="log-line">
          <div className="log-date">{formatDate('yyyy-MM-dd HH:mm:ss', new Date(item.date))}</div>
          <div className="log-hyphen"> - </div>
          <div className={`log-message ${item.level}`}>{item.message}</div>
        </div>)
    }
      <div ref={divEndRef} />
    </div> : '');
};

export default Log;
