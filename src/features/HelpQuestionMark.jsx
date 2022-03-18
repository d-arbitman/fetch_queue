import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';

const getOverlay = (helpText) => {
  return <Tooltip id="button-tooltip-2">{helpText}</Tooltip>;
};

export const HelpQuestionMark = (props) => {
  return (
    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={getOverlay(props.helpText)}>
      <div className="help-tip">&nbsp;&nbsp;?&nbsp;&nbsp;</div>
    </OverlayTrigger>
  );
};

HelpQuestionMark.propTypes = {
  helpText: PropTypes.string.isRequired,
};

export default HelpQuestionMark;
