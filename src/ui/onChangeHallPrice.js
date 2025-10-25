import makeApiRequest from '../api/makeApiRequest';
import getFormData from '../api/getFormData';
import showMessageSaved from './showMessageSaved';

export default function onChangeHallPrice(event, onDataHallChange, sethallPriceStandard, setHallPriceVip) {
  event.preventDefault();
  const { currentTarget } = event;
  const data = getFormData(currentTarget);
  const hallId = data.hallId;
  delete data.hallId;

  if (+data.priceStandart >= 0 && +data.priceVip >= 0) {
    makeApiRequest({
      url: 'price/' + hallId,
      method: 'POST',
      headers: {
        'Content-Type': 'applicaton/json'
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.success) {
        onDataHallChange(response.result);
        sethallPriceStandard(response.result.hall_price_standart);
        setHallPriceVip(response.result.hall_price_vip);
        showMessageSaved(currentTarget);
      } else {
        alert(response.error);
      }
    });
  } else {
    alert('Цены не могут быть отрицательными');
  }
};