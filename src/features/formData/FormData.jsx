import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Logging
import { appendLog } from '../log/Log.slice.js';
import { interpolate } from '../../util/log.js';

// visual components
import { JsonEditor as Editor } from 'jsoneditor-react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ComboBox from 'react-responsive-combo-box';
import Accordion from 'react-bootstrap/Accordion';

// CSS
import 'react-responsive-combo-box/dist/index.css';
import './FormData.css';

import { readFile } from '../../util/file.js';
import { getObjectFromSeparatedString, looksLikeJSON, objectToSeparatedString, stringToObject, objectToFormBody } from '../../util/string.js';
import { setMultipleValues, setValue } from './formData.slice.js';
import storage from '../../util/storage.js';
import FetchQueue from '../../util/FetchQueue.js';
import HelpQuestionMark from '../HelpQuestionMark.jsx';
import QueuedRequestsModal from '../QueuedRequestsModal.jsx';

const noop = () => {
  Function.prototype();
};

const fetchQueue = new FetchQueue(1);

const validateForm = (data) => {
  return data && data.apiUrl && data.contentType && (data.format === 'JSON' || (data.format === 'CSV' && data.separator) && data.data && data.data.length > 0);
};

const FormData = () => {
  const formData = useSelector((state) => state.formData),
    dispatch = useDispatch(),
    [changedFields, setChangedFields] = useState({}),
    [jsonEditor, setJsonEditor] = useState(false),
    [concurrentConnections, setConcurrentConnections] = useState(1),
    [queueInfo, setQueueInfo] = useState({ active: 0, queued: 0, status: 'idle' });

  const log = (level, str, ...rest) => {
    const message = (rest) ? interpolate(str, ...rest) : str;

    dispatch(appendLog({ level, message }));
  };

  const resetQueue = (e) => {
    e.preventDefault();

    if (queueInfo.queued === 0) {
      log('error', 'No requests queued');
    } else {
      setQueueInfo({ ...queueInfo, queued: 0 });
      fetchQueue.resetQueue();
      log('info', 'Queue cleared');
    }
  };

  const apiRequestSuccess = (req, data) => {
    log('info', 'request: {} {}', req.url, req.options.body.substring(0, Math.min(60, req.options.body.length)) + (req.options.body.length > 60 ? '...' : ''));
    log('info', 'response: {}', data, null);
  };

  const apiRequestFailure = (error) => {
    console.error('Error:', error);
    log('error', 'Fetch error: {}', error.message);
  };

  const queueUpdated = (queued, active) => {
    if (queued.length !== queueInfo.queued || active.length !== queueInfo.length) {
      setQueueInfo({ ...queueInfo, queued: queued.length, active: active.length });
    }
  };

  const statusUpdated = (status) => {
    if (status.name !== queueInfo.status) {
      setQueueInfo({ ...queueInfo, status: status.name });
    }
  };

  fetchQueue.setCallback(apiRequestSuccess);
  fetchQueue.setErrorCallback(apiRequestFailure);
  fetchQueue.setQueueUpdatedCallback(queueUpdated);
  fetchQueue.setStatusUpdatedCallback(statusUpdated);

  const handleDataUpdate = (newData) => {
    const event = {
      preventDefault: () => {
        noop();
      },
      target: {
        name: 'data',
        value: formData.format === 'JSON' ? JSON.stringify(newData, null, 2) : objectToSeparatedString(newData, formData.separator || ';')
      }
    };

    handleFieldUpdate(event);
  };

  const doExecuteRequests = () => {
    try {
      fetchQueue.executeRequests();
    } catch (err) {
      log('error', 'Problem with the API: {}', err.message);
    }
  };

  const handleFieldUpdate = (e) => {
    const value = e.target.value,
      name = (e.target.id && e.target.type !== 'radio') ? e.target.id : e.target.name;

    updateChangedFields(name);
    dispatch(setValue({ name, value }));
  };

  const submit = (e, immediatelyProcess) => {
    e.preventDefault();

    // save apiUrl for easy access later
    storage.setApiUrl(formData.apiUrl);

    const dataToPost = stringToObject(formData.data, formData.separator, formData.format),
      beginningCount = fetchQueue.queuedRequests.length;

    // queue requests in data textarea
    for (const reqData of dataToPost) {
      const formBody = (formData.contentType === 'application/json') ? JSON.stringify(reqData) : objectToFormBody(reqData);

      fetchQueue.addRequest(formData.apiUrl, {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': formData.contentType },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: formBody,
      });
    }

    const addedRequests = (fetchQueue.queuedRequests.length - beginningCount);

    log('debug', 'Added {} request{} to queue', addedRequests, addedRequests === 1 ? '' : 's');

    if (immediatelyProcess) {
      log('debug', 'Executing requests now');
      doExecuteRequests();
    }
  };

  const processQueue = (e) => {
    e.preventDefault();

    if (queueInfo.queued === 0) {
      log('error', 'No requests queued');
    } else {
      doExecuteRequests();
    }
  };

  const replaceDataWithFile = (e) => {
    readFile(e.target.files[0], (result) => {
      const oldState = JSON.parse(JSON.stringify(formData)),
        fileData = (result || '').trim();

      oldState.data = fileData;
      oldState.format = (looksLikeJSON(fileData)) ? 'JSON' : 'CSV';

      log('info', 'state after: {}', oldState);

      dispatch(setMultipleValues(oldState));
    }, error => log('error', 'Could not read file: {}', error));

    e.target.value = '';
  };

  const updateChangedFields = (name) => {
    setChangedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));
  };

  const notImplemented = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    log('error', 'not implemented yet');
  };

  const getEditorData = () => {
    if (formData.format === 'JSON') {
      try {
        return JSON.parse(formData.data);
      } catch (e) {
        log('error', 'Cannot parse JSON data, old data: {}', formData.data);
        return [];
      }
    } else {
      return getObjectFromSeparatedString(formData.data, formData.separator);
    }
  };

  const toggleJsonEditor = (e) => {
    e.preventDefault();
    setJsonEditor(!jsonEditor);
  };

  const invalidRequiredField = (field) => {
    return changedFields && changedFields[field] && !formData[field] && <div className="error">This field is required</div>;
  };

  const invalidRequiredIntegerField = (field) => {
    if (formData) {
      const elem = document.getElementById(field) || { min: 0, max: 0 },
        num = parseInt(elem.value, 10),
        min = parseInt(elem.min, 10),
        max = parseInt(elem.max, 10);

      if (min === max && min === 0) {
        return '';
      }

      if (invalidRequiredField(field) || isNaN(num) || num < min || num > max) {
        return <div className="error">This field is required and must be an integer between {min} and {max}</div>;
      }
    }

    return '';
  };

  return (
    <div className="main-form">
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="concurrentConnections">
          <Form.Label column sm={2}>
            Concurrent Connections <HelpQuestionMark helpText="How many simultaneous requests to make? Usually, you should set this to 1" />
          </Form.Label>
          <Col sm={10}>
            {invalidRequiredIntegerField('concurrentConnections')}
            <Form.Control
              type="number"
              min={1} max={10}
              maxLength={1}
              value={'' + concurrentConnections}
              onChange={e => {
                const numConnections = parseInt(e.target.value, 10);

                updateChangedFields(e.target.name);
                setConcurrentConnections(numConnections);
                fetchQueue.numActiveRequests = numConnections;
              }} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="apiUrl">
          <Form.Label column sm={2}>
            API URL <HelpQuestionMark helpText="URL to send data to" />
          </Form.Label>
          <Col sm={10}>
            {invalidRequiredField('apiUrl')}
            <ComboBox options={storage.getApiUrls()} inputClassName="form-control" style={{ width: '100%' }} enableAutocomplete defaultValue="" name="apiUrl" onChange={(e) => handleFieldUpdate(e)} onBlur={(e) => handleFieldUpdate(e)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="contentType">
          <Form.Label column sm={2}>
            Request Content Type <HelpQuestionMark helpText="Content type to send the data with" />
          </Form.Label>
          <Col sm={10}>
            {invalidRequiredField('contentType')}
            <Form.Select aria-label="Content Type" id="contentType" onChange={e => handleFieldUpdate(e)} onBlur={(e) => handleFieldUpdate(e)} value={(formData && formData.contentType) || ''}>
              <option value="">Content Type</option>
              <option value="application/x-www-form-urlencoded">URL Encoded</option>
              <option value="application/json">JSON</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Data Format <HelpQuestionMark helpText="Format of the data text area" />
          </Form.Label>
          <Col sm={10}>
            <div key="json-radio" className="mb-3">
              <Row>
                <Col sm={1}><Form.Check type="radio" id="json-radio" label="JSON" name="format" value="JSON" defaultChecked={true} onChange={e => handleFieldUpdate(e)} />
                </Col>
                <Col sm={11} />
              </Row>
              <Row>
                <Col sm={1} />
                <Col sm={11}>{formData && formData.format === 'CSV' && invalidRequiredField('separator')}</Col>
              </Row>
              <Row>
                <Col sm={1}>
                  <Form.Check type="radio" id="csv-radio" label="CSV" name="format" value="CSV" onChange={e => handleFieldUpdate(e)} />
                </Col>
                <Col sm={11}>
                  <Form.Control type="text" id="separator" defaultValue=";" maxLength={1} onChange={e => handleFieldUpdate(e)} disabled={formData && formData.format !== 'CSV'} />
                </Col>
              </Row>
            </div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="data">
          <Row>
            <Col sm={1}>
              <Form.Label>Data <HelpQuestionMark helpText="CSV or JSON array of objects to send to API URL" /></Form.Label>
            </Col>
            <Col sm={1}>|</Col>
            <Col sm={10}><a href="#" onClick={(e) => toggleJsonEditor(e)}>Toggle JSON Editor</a></Col>
          </Row>
          <Row>{ formData && (!formData.data || formData.length === 0) && invalidRequiredField('data') }</Row>
          <Row>
            { jsonEditor
              ? <Editor value={getEditorData()} onChange={(newData) => handleDataUpdate(newData)} />
              : <Form.Control as="textarea" rows={8} value={formData && formData.data} onChange={(e) => handleFieldUpdate(e)} onBlur={(e) => handleFieldUpdate(e)} /> }
          </Row>
        </Form.Group>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item>
              <Accordion.Header>Replace data with...</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col sm={1} />
                  <Col sm={11}>
                    <Form.Group as={Row} controlId="formFile" className="mb-3">
                      <Form.Label>a local file <HelpQuestionMark helpText="Use a file from your computer to replace the data" /></Form.Label>
                      <Form.Control type="file" onChange={e => replaceDataWithFile(e)} />
                    </Form.Group>
                  </Col>
                </Row>
                {'' && <Row className="mb-3">
                  <Col sm={1} />
                  <Col sm={11}>
                    <Row>
                      <Form.Label htmlFor="downloadUrl">a remote file</Form.Label>
                    </Row>
                    <Row>
                      <Col sm={8}><Form.Control type="text" id="downloadUrl" defaultValue="" /></Col>
                      <Col sm={4}><Button variant="info" onClick={e => notImplemented(e)}>Download</Button></Col>
                    </Row>
                  </Col>
                </Row> }
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>

        <Row className="mb-3">
          <Col>
            <Button variant="primary" disabled={!validateForm(formData)} title="Queue Requests" onClick={e => submit(e, 0)}>Queue Requests</Button>
          </Col>
          <Col>
            <Button variant="warning" title="Process Requests in queue" onClick={e => processQueue(e)}>Process Queue</Button>
          </Col>
          <Col>
            <Button variant="warning" disabled={!validateForm(formData)} title="Process Requests in data field and queue" onClick={e => submit(e, 1)}>Process Requests</Button>
          </Col>
          <Col>
            <Button variant="primary" title="Reset queue" onClick={e => resetQueue(e)}>Reset Queue</Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col><QueuedRequestsModal fetchQueue={fetchQueue} /></Col>
          <Col>Active Requests: {queueInfo.active}</Col>
          <Col>Queue status: {queueInfo.status}</Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormData;
