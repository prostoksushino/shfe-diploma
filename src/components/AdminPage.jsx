import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import makeApiRequest from '../api/makeApiRequest.js';
import logoAdmin from '../assets/svg/logo_admin.svg';
import HallItem from './HallItem.jsx';
import multiplication from '../assets/svg/x.svg';
import chair from '../assets/svg/chair.svg';
import chairVip from '../assets/svg/chair-vip.svg';
import chairNone from '../assets/svg/chair-none.svg';
import AddFilm from './popups/AddFilm.jsx';
import AddSeance from './popups/AddSeance.jsx';
import AddHall from './popups/AddHall.jsx';
import { createHall, addFilm } from '../ui/btnPopupVisibility.js';
import getEndingOfWord from '../utils/getEndingOfWord.js';
import calcSeanceTimeInGrid from '../utils/calcSeanceTimeInGrid.js';
import getFilmBgColor from '../utils/getFilmBgColor.js';
import calcWidthInPercent from '../utils/calcWidthInPercent.js';
import onMovingFilmToAdd from '../ui/onMovingFilmToAdd.js';
import onMovingFilmToRemove from '../ui/onMovingFilmToRemove.js';
import onRemoveHall from '../ui/onRemoveHall.js';
import onRemoveFilm from '../ui/onRemoveFilm.js';
import SeatMap from './SeatMap.jsx';
import cancelHallConfig from '../ui/cancelHallConfig.js';
import updateHallConfig from '../ui/updateHallConfig.js';
import onCancelHallPrice from '../ui/onCancelHallPrice.js';
import onChangeHallPrice from '../ui/onChangeHallPrice.js';
import onChangeSeances from '../ui/onChangeSeances.js';
import onOpenSale from '../ui/onOpenSale.js';

const AdminPage = () => {
  const [data, setData] = useState({
    halls: [],
    films: [],
    seances: []
  });
  const [dataForSeance, setDataForSeance] = useState([]);
  const [hallConfigId, setHallConfigId] = useState('');
  const [hallRowsCount, setHallRowsCount] = useState(0);
  const [hallPlacesCount, setHallPlacesCount] = useState(0);
  const [hallConfig, setHallConfig] = useState([]);
  const [hallPriceId, setHallPriceId] = useState(0);
  const [hallPriceStandard, sethallPriceStandard] = useState(0);
  const [hallPriceVip, setHallPriceVip] = useState(0);
  const [dataSeances, setDataSeances] = useState([]);
  const [openSaleValue, setOpenSaleValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login');
    }

    makeApiRequest({
      url: 'alldata',
      method: 'GET',
    }).then((response) => {
      if (response?.success) {
        setData(response.result);
        setHallRowsCount(response.result.halls[0]?.hall_rows ?? 0);
        setHallPlacesCount(response.result.halls[0]?.hall_places ?? 0);
        setHallConfig(response.result.halls[0]?.hall_config);
        setHallConfigId(response.result.halls[0]?.id);
        sethallPriceStandard(response.result.halls[0]?.hall_price_standart ?? 0);
        setHallPriceVip(response.result.halls[0]?.hall_price_vip ?? 0);
        setHallPriceId(response.result.halls[0]?.id ?? 0);
        setDataSeances(response.result?.seances);
        setOpenSaleValue(response.result.halls[0]?.hall_open);
      }
    });
  }, [
    navigate,
    setData,
    setHallRowsCount,
    setHallPlacesCount,
    setHallConfig,
    sethallPriceStandard,
    setHallPriceVip,
    setOpenSaleValue
  ]);

  const onDataChange = (newData) => {
    setData((data) => ({ ...data, ...newData }));
  };

  const onDataHallChange = (newDataHall) => setData((data) => ({
    ...data,
    halls: data.halls.map(hall => {
      return hall.id === newDataHall.id ? newDataHall : hall;
    })
  }));

  const onDataHallValuesChange = (newDataHallValues) => {
    setHallRowsCount(newDataHallValues?.hall_rows ?? 0);
    setHallPlacesCount(newDataHallValues?.hall_places ?? 0);
    setHallConfig(newDataHallValues?.hall_config);
    sethallPriceStandard(newDataHallValues?.hall_price_standart ?? 0);
    setHallPriceVip(newDataHallValues?.hall_price_vip ?? 0);
    setOpenSaleValue(newDataHallValues?.hall_open ?? 0);
  };

  const onDataSeancesAdd = (newDataSeances) => setDataSeances((data) => ([...data, newDataSeances]));
  const onDataSeanceRemove = (id) => setDataSeances((data) => (data.filter(seance => seance.id !== id)));
  const onDataSeancesChange = (data) => setDataSeances(data.seances);
  const onDataForSeance = (newDataSeance) => setDataForSeance(newDataSeance);

  const root = document.querySelector(':root');
  if (root) {
    root.classList.add('root__admin');
  }

  return (
    <div className="page">
      <header className="header">
        <Link to="/">
          <img src={logoAdmin} alt="home" />
        </Link>
      </header>

      <main className="admin-main">
        <section className="admin-section">
          <header className="admin-section__header">
            <h2 className="admin-section__title">Управление залами</h2>
          </header>

          <div className="admin-settings admin-settings_create-hall">
            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Доступные залы:
              </p>

              {data?.halls?.map(hall => {
                return (
                  <div className="admin-settings__hall-name" key={hall.id}>
                    <span>- {hall.hall_name}</span>
                    <button
                      className="admin-settings__btn-remove"
                      type="button"
                      onClick={(event) => onRemoveHall(event, hall.id, hall.hall_name, onDataChange, onDataHallValuesChange)}
                    />
                  </div>
                );
              })}

            </div>
            <div className="actions actions_create-hall">
              <button className="btn_ok" onClick={event => createHall(event)}>Создать зал</button>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <header className="admin-section__header">
            <h2 className="admin-section__title">Конфигурация залов</h2>
          </header>
          <form
            className="admin-settings"
            onSubmit={(event) => {
              updateHallConfig(event, onDataHallChange, setHallConfig);
            }}
          >
            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Выберите зал для конфигурации:
              </p>

              <div className="halls__list">
                {data?.halls?.map((hall, index) => {
                  return (
                    <HallItem hall={hall} index={index} key={hall.id} idName="hall-configuration" onClickFunc={() => {
                      setHallConfigId(hall.id);
                      setHallRowsCount(hall.hall_rows);
                      setHallPlacesCount(hall.hall_places);
                      setHallConfig(hall.hall_config);
                    }} />
                  );
                })}
              </div>
            </div>

            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Укажите количество рядов и максимальное количество кресел в ряду:
              </p>
              <div className="hall-size">
                <label className="admin__label hall-size__label">
                  Рядов, шт
                  <input
                    className="admin__input hall-size__input"
                    type="number"
                    name="rowCount"
                    value={hallRowsCount}
                    onChange={event => {
                      const rowCountValue = Number(event.currentTarget.value);
                      if (rowCountValue > 0) {
                        setHallRowsCount(rowCountValue);
                      }
                    }}
                    placeholder="10"
                    required
                  />
                </label>

                <img className="admin__multiply" src={multiplication} alt="multiply" />
                <label className="admin__label hall-size__label">
                  Мест, шт
                  <input
                    className="admin__input hall-size__input"
                    type="number"
                    name="placeCount"
                    value={hallPlacesCount}
                    onChange={event => {
                      const placeCountValue = Number(event.currentTarget.value);
                      if (placeCountValue > 0) {
                        setHallPlacesCount(placeCountValue);
                      }
                    }}
                    placeholder="8"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Теперь вы можете указать типы кресел на схеме зала:
              </p>
              <div className="chair-types">
                <span className="chair-types__item"><img src={chair} alt="chair" />— обычные кресла</span>
                <span className="chair-types__item"><img src={chairVip} alt="chair-vip" />— VIP кресла</span>
                <span className="chair-types__item"><img src={chairNone} alt="chair-none" />— заблокированные (нет кресла)</span>
              </div>
              <p className="chair-types__description">
                Чтобы изменить вид кресла, нажмите по нему{(window.innerWidth >= 1199) ? " левой кнопкой мыши" : ""}
              </p>

              <SeatMap
                hallRowsCount={hallRowsCount}
                hallPlacesCount={hallPlacesCount}
                hallConfig={hallConfig}
                setHallConfig={newHallConfig => setHallConfig(newHallConfig)}
                isAdminPage={true}
              />
            </div>

            <div className="actions actions_halls-configuration">
              <button
                className="btn_cancel"
                type="button"
                onClick={event => cancelHallConfig(event, data, hallConfigId, setHallRowsCount, setHallPlacesCount, setHallConfig, hallConfig)}
              >
                Отмена
              </button>
              <button className="btn_ok btn_save">Сохранить</button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <header className="admin-section__header">
            <h2 className="admin-section__title">Конфигурация цен</h2>
          </header>

          <form
            className="admin-settings"
            onSubmit={(event) => {
              onChangeHallPrice(event, onDataHallChange, sethallPriceStandard, setHallPriceVip);
            }}
          >
            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Выберите зал для конфигурации:
              </p>

              <div className="halls__list">
                {data?.halls?.map((hall, index) => {
                  return (
                    <HallItem hall={hall} index={index} key={hall.id} idName="price-configuration" onClickFunc={() => {
                      setHallPriceId(hall.id);
                      sethallPriceStandard(hall.hall_price_standart);
                      setHallPriceVip(hall.hall_price_vip);
                    }} />
                  );
                })}
              </div>
            </div>

            <div className="admin-settings__item">
              <p className="admin-settings__title">
                Установите цены для типов кресел:
              </p>
              <div className="seat-price">
                <label className="admin__label seat-price__label">
                  Цена, рублей
                  <div className="seat-price__item">
                    <input
                      className="admin__input seat-price__input"
                      type="number"
                      name="priceStandart"
                      value={hallPriceStandard}
                      onChange={(event) => {
                        const priceStandartValue = Number(event.currentTarget.value);
                        if (priceStandartValue >= 0) {
                          sethallPriceStandard(priceStandartValue);
                        } else {
                          sethallPriceStandard(0);
                        }
                      }}
                      placeholder="0"
                      required
                    />
                    <span className="seat-price__type"> за <img src={chair} alt="chair" /> обычные кресла</span>
                  </div>
                </label>

                <label className="admin__label seat-price__label">
                  Цена, рублей
                  <div className="seat-price__item">
                    <input
                      className="admin__input seat-price__input"
                      type="number"
                      name="priceVip"
                      value={hallPriceVip}
                      onChange={(event) => {
                        const priceVipValue = Number(event.currentTarget.value);
                        if (priceVipValue >= 0) {
                          setHallPriceVip(priceVipValue);
                        } else {
                          setHallPriceVip(0);
                        }
                      }}
                      placeholder="0"
                      required
                    />
                    <span className="seat-price__type">за <img src={chairVip} alt="chair-vip" /> VIP кресла</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="actions actions_price-configuration">
              <button
                className="btn_cancel"
                type="button"
                onClick={event => onCancelHallPrice(event, data, hallPriceId, sethallPriceStandard, setHallPriceVip)}>
                Отмена
              </button>
              <button className="btn_ok btn_save">Сохранить</button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <header className="admin-section__header">
            <h2 className="admin-section__title">Сетка сеансов</h2>
          </header>

          <form
            className="admin-settings admin-settings_grid"
            onSubmit={event => onChangeSeances(event, data, onDataChange, dataSeances, onDataSeancesChange)}
          >
            <div className="admin-settings__item">
              <button className="btn_ok" type="button" onClick={event => addFilm(event)}>Добавить фильм</button>
            </div>

            <div className="admin-settings__movies">
              {data?.films?.map(film => {
                return (
                  <div
                    className="admin-settings__movie-item"
                    data-id={film.id}
                    key={film.id}
                  >
                    <div
                      className="admin-settings__movie-container"
                      onMouseDown={event => { onMovingFilmToAdd(event, onDataForSeance) }}
                    >
                      <img className="admin-settings__movie-img" src={film.film_poster} alt="poster" />
                      <div className="admin-settings__movie-description">
                        <div className="admin-settings__movie-title">
                          <p className="admin-settings__movie-name">{film.film_name}</p>
                          <p className="admin-settings__movie-duration" data-duration={film.film_duration}>
                            {film.film_duration} минут{getEndingOfWord(film.film_duration, "минут")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      className="admin-settings__btn-remove admin-settings__btn-remove_movie"
                      type="button"
                      onClick={event => { onRemoveFilm(event, film.id, onDataChange, film.film_name) }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="admin-settings__halls-grid">
              {data?.halls?.map(hall => {
                return (
                  <div className="admin-settings__hall-item" key={hall.id}>
                    <div className="admin-settings__hall-title">{hall.hall_name}</div>
                    <div className="admin-settings__hall-grid">
                      {dataSeances.map(seance => {
                        if (seance.seance_hallid === hall.id) {
                          const filmId = seance.seance_filmid;
                          const filmName = data?.films?.find(film => film.id === filmId).film_name;
                          const seanceTimeInGrid = calcSeanceTimeInGrid(seance.seance_time);
                          const bgColor = getFilmBgColor(filmId);
                          const widthInPercent = calcWidthInPercent(filmId);

                          return (
                            <div
                              className="admin-settings__movie-in-grid"
                              onMouseDown={event => { onMovingFilmToRemove(event, onDataSeanceRemove, seance.id, data) }}
                              style={{ left: seanceTimeInGrid + "%", backgroundColor: bgColor, width: widthInPercent + "%" }}
                              data-id={filmId}
                              key={seance.id}
                            >
                              <div className="admin-settings__movie-text">{filmName}</div>
                              <div className="admin-settings__movie-mark" data-content={seance.seance_time} />
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="actions actions_seance-grid">
              <button className="btn_cancel" type="button" onClick={() => setDataSeances(data?.seances)}>Отмена</button>
              <button
                className="btn_ok btn_save"
              >
                Сохранить
              </button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <header className="admin-section__header">
            <h2 className="admin-section__title">Открыть продажи</h2>
          </header>

          <form
            className="admin-settings"
            onSubmit={(event) => {
              onOpenSale(event, onDataChange, openSaleValue, setOpenSaleValue);
            }}
          >
            <div className="admin-settings__item">
              <p className="admin-settings__title admin-settings__title_open-sale">
                Выберите зал для открытия/закрытия продаж:
              </p>

              <div className="halls__list">
                {data?.halls?.map((hall, index) => {
                  return (
                    <HallItem hall={hall} index={index} key={hall.id} idName="open-sale" onClickFunc={() => {
                      setOpenSaleValue(hall.hall_open);
                    }} />
                  );
                })}
              </div>
            </div>

            <p className="admin-settings__description">
              {openSaleValue === 0 ? "Всё готово к открытию" : ""}
            </p>
            <div className="actions actions_open-sale">
              <button className="btn_ok">
                {openSaleValue === 0 ? "Открыть продажу билетов" : "Приостановить продажу билетов"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <AddFilm onDataChange={newData => onDataChange(newData)} />
      <AddSeance
        data={data}
        dataForSeance={dataForSeance}
        onDataSeancesAdd={newDataSeances => onDataSeancesAdd(newDataSeances)}
      />
      <AddHall
        onDataChange={newData => onDataChange(newData)}
        onDataHallValuesChange={newDataHallValues => onDataHallValuesChange(newDataHallValues)}
      />
    </div>
  );
};

export default AdminPage;