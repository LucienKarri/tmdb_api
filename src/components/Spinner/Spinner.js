import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
import React from "react";

import './Spinner.css';

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const Spinner = () => {
    return (
        <div className='spinner'>
            <Spin indicator={antIcon} />
        </div>
    )
}

export default Spinner;
