import React from 'react';
import { SvgIcon } from '@material-ui/core';
import { arrowBackIosSvg } from '../../../utils/icons-data';

const ArrowBackIosIcon = ({onClick}) => {
    return (
        <SvgIcon
            version="1.1"
            id="arrowIcon"
            x="0px"
            y="0px"
            viewBox="0 0 477.175 477.175"
            style={{ width: '16px', height: '16px' }}
            onClick={onClick}
        >
            <g>
                <path d={arrowBackIosSvg.path} />
            </g>
        </SvgIcon>

    )
}

export default ArrowBackIosIcon;
