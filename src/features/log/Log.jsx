import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearLog, setLevel } from './Log.slice.js';
import { formatDate } from '../../util/date.js';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HelpQuestionMark from '../HelpQuestionMark.jsx';
import './Log.css';

const Log = () => {
  const logData = useSelector((state) => state.log),
    logLevel = useSelector((state) => state.log.level),
    dispatch = useDispatch(),
    divEndRef = useRef(null),
    levels = { debug: 0, info: 1, error: 2 },
    changeLogLevel = (e) => {
      e.preventDefault();
      dispatch(setLevel(e.target.value));
    },
    clearTheLog = (e) => {
      e.preventDefault();
      dispatch(clearLog());
    };

  useEffect(() => {
    if (divEndRef && divEndRef.current && divEndRef.current.scrollIntoView) {
      divEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    logData.entries
      ? <div>
        <Row>
          <Col className="header">Log</Col>
          <Col sm={2}>
            <Form.Select aria-label="Log Level" id="logLevel" onChange={e => changeLogLevel(e)} value={logLevel || 'info'}>
              <option value="debug">debug</option>
              <option value="info">info</option>
              <option value="error">error</option>
            </Form.Select>
          </Col>
          <Col sm={1}><HelpQuestionMark helpText="Set the log level to filter messages" /></Col>
          <Col><Button variant="warning" title="Clear Log" onClick={e => clearTheLog(e)}>Clear Log</Button></Col>
        </Row>
        <div className="log">
          {
            logData.entries
              .filter(item => levels[item.level] >= levels[logData.level])
              .map((item, i) => <div key={i} className="log-line">
                <div className="log-date">{formatDate('yyyy-MM-dd HH:mm:ss', new Date(item.date))}</div>
                <div className="log-hyphen"> -</div>
                <div className={`log-message ${item.level}`}>{item.message}</div>
              </div>)
          }
          <div ref={divEndRef} />
        </div>
      </div> : '');
};

export default Log;
