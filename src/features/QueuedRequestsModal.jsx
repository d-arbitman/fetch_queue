import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './QueuedRequestsModal.css';
import PropTypes from 'prop-types';

export const QueuedRequestsModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = (e) => {
      e.preventDefault();
      setShow(false);
    },
    handleShow = (e) => {
      e.preventDefault();
      if (props.fetchQueue.queuedRequests.length > 0) {
        setShow(true);
      }
    },
    requests = props.fetchQueue.queuedRequests;

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

QueuedRequestsModal.propTypes = {
  fetchQueue: PropTypes.object.isRequired,
};
