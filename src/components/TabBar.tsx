import React from 'react';
import '../assets/css/base.css';
import '../assets/css/style.css';
// @ts-ignore
import { globalValue, toPage } from '../utils/common';

const tabBarIndexName = 'TabBarIndex';
const TabBar = () => {
  const onClick = (name: string) => {
    if (globalValue(tabBarIndexName) !== name) {
      globalValue(tabBarIndexName, name);
      toPage(name);
    }
  };
  return (
    <span>
      <div className="nav">
        <div className="navcon">
          <ul className="clearfix">
            <li
              className={
                globalValue(tabBarIndexName) === 'home' ||
                !globalValue(tabBarIndexName)
                  ? 'cur'
                  : ''
              }
              onClick={() => onClick('home')}
            >
              <a>
                <span>
                  <i className="ico ico29"></i>
                </span>
                首&nbsp;页
              </a>
            </li>
            <li
              className={
                globalValue(tabBarIndexName) === 'service' ? 'cur' : ''
              }
              onClick={() => onClick('service')}
            >
              <a>
                <span>
                  <i className="ico ico30"></i>
                </span>
                服&nbsp;务
              </a>
            </li>
            <li
              className={globalValue(tabBarIndexName) === 'my' ? 'cur' : ''}
              onClick={() => onClick('my')}
            >
              <a>
                <span>
                  <i className="ico ico31"></i>
                </span>
                我&nbsp;的
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navhi"></div>
    </span>
  );
};

export default TabBar;
