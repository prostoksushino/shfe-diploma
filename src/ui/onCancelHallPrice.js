const onCancelHallPrice = (event, data, hallPriceId, sethallPriceStandard, setHallPriceVip) => {
  event.preventDefault();
  const form = event.currentTarget.closest('form');
  const prevPriceStandart = data?.halls?.find(hall => hall.id === +hallPriceId)?.hall_price_standart ?? form.priceStandart.value;
  const prevPriceVip = data?.halls?.find(hall => hall.id === +hallPriceId)?.hall_price_vip ?? form.priceVip.value;

  form.priceStandart.value = prevPriceStandart;
  form.priceVip.value = prevPriceVip;
  sethallPriceStandard(prevPriceStandart);
  setHallPriceVip(prevPriceVip);
};

export default onCancelHallPrice;