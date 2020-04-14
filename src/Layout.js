import React, { useEffect, useState } from "react";
import imagesJson from './images'
import imagesLoaded from 'imagesloaded';
import { paths } from './App';
import { useAuth } from './authenticateUser';

function getImgUrl(farm_id, server, photo_id, secret) {
  return `https://farm${farm_id}.staticflickr.com/${server}/${photo_id}_${secret}.jpg`;
}

export default function Layout(props) {
  const allItems = document.getElementsByClassName("item");

  function resizeGridItem(item) {
    const grid = document.getElementsByClassName("grid")[0];
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const rowSpan = item.querySelector('.content') ? Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)) : 0;
    item.style.gridRowEnd = "span " + rowSpan;
  }

  function resizeAllGridItems() {
    // allItems = document.getElementsByClassName("item");
    for (let x = 0; x < allItems.length; x++) {
      resizeGridItem(allItems[x]);
    }
  }

  function resizeInstance(instance) {
    const item = instance.elements[0];
    resizeGridItem(item);
  }

  useEffect(function () {
    resizeAllGridItems();
    window.addEventListener('resize', resizeAllGridItems)
    for (let x = 0; x < allItems.length; x++) {
      imagesLoaded(allItems[x], resizeInstance);
    }
  }, []);

  const [userAuthState, handleAuthenticateUser, handleLogout] = useAuth();
  const [imgSelId, setImgSelid] = useState('');

  function handleSelectImg(id) {
    return () => {
      setImgSelid(id)
      props.history.push(paths.layout + '/' + id);
    };
  }

  const imageArr = imagesJson.rsp.photos.photo;

  return (
    <div>
      <div className="header">
        <span className="header__title"></span>
        <button className="header__logout" onClick={handleLogout}>Logout</button>
      </div>
      <div class="grid">
        {
          imageArr.map(function (img) {
            // farm_id, server, photo_id, secret
            const url = getImgUrl(img['-farm'], img['-server'], img['-id'], img['-secret']);
            return (
              <div className="item photo">
                <div class={imgSelId === img['-id'] ? 'content highlight' : 'content'} onClick={handleSelectImg(img['-id'])}><img class="photothumb" src={url} alt={'img'} /></div>
              </div>

            )
          })
        }
      </div>
    </div>

  )





}


