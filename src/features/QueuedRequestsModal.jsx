import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './QueuedRequestsModal.css';
import PropTypes from 'prop-types';

const QueuedRequestsModal = (props) => {
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
      <OverlayTrigger
        delay={{ show: 250, hide: 400 }}
        placement="top-start"
        overlay={requests.length > 0 ? <Tooltip id="button-tooltip-2">Click to see the queued requests</Tooltip> : <></>}
        defaultShow={false}
        flip={false}>
        <div onClick={handleShow}>
          Queued Requests: {requests.length}
        </div>
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Queued Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul style={{ fontFamily: 'monospace', fontSize: 'smaller' }}>
            {
              requests.map((item, i) => <li key={i}>{item.url}
                <ul>
                  <li style={{ fontWeight: item.options.body !== '' ? 'normal' : 'bold' }}>{item.options.body !== '' ? item.options.body : ' - empty request -'}</li>
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

export default QueuedRequestsModal;
