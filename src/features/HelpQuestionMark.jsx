import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const getOverlay = (props) => {
  return <Tooltip id="button-tooltip-2">{props.helpText}</Tooltip>;
};

const HelpQuestionMark = (props) => {
  return (
    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={getOverlay(props)}>
      <div className="help-tip">&nbsp;&nbsp;?&nbsp;&nbsp;</div>
    </OverlayTrigger>
  );
};

export default HelpQuestionMark;
