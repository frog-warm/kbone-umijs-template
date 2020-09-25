import React, { useState, useEffect } from 'react';
import request from '../utils/request';

const MyTop = () => {
  const [img, setImg] = useState(
    'http://blog.tuzuyong.net/cqccn/images/mzuserimg.png',
  );

  useEffect(() => {
    request.get('/api/test.json').then((rsp) => {
      console.log(rsp);
      setImg(rsp.data.img);
    });
  }, []);

  return (
    <div className="webg">
      <div className="wees">
        <dl className="clearfix">
          <dt>
            <a href="#">
              <img src={img} />
            </a>
          </dt>
          <dd>
            <p className="ti mt10">
              <a href="#" className="loginbtn">
                登录
              </a>
            </p>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default MyTop;
