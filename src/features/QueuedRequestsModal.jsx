import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './QueuedRequestsModal.css';

const QueuedRequestsModal = (prop) => {
  const [show, setShow] = useState(false);

  const handleClose = (e) => {
      e.preventDefault();
      return setShow(false);
    },
    handleShow = (e) => {
      e.preventDefault();
      return setShow(true);
    },
    requests = prop.fetchQueue.queuedRequests;

  return (
    <div>
      <div onClick={handleShow}>
        Queued Requests: {requests.length}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Queued Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul style={{ fontFamily: 'monospace', fontSize: 'smaller' }}>
            {
              requests.map((item, i) => <li key={i}>{item.url}
                <ul>
                  <li>{item.options.body}</li>
                </ul>
              </li>)
            }
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QueuedRequestsModal;
