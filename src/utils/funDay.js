/*
 * Функции работы с датами
 */

import 'dotenv/config.js';

/**
 * @description Получим текущий день у клиента в числовом формате YYMMDD
 * @param  {number} timezone
 * @returns {number} день в формате YYMMDD
 */
export function getDay(timezone) {

  let timeClient = new Date();

  // час, когда мы считаем, что начался новый день 
  const hourStart = process.env.HOUR_WHEN_DAY_STARTS

  // получим время клиента как времяСервера + таймЗона - hourStart
  timeClient.setHours(timeClient.getHours() + timezone - hourStart);

  const dd = (timeClient.getDate() < 10) ? `0${timeClient.getDate()}` : timeClient.getDate();
  const mm = (timeClient.getMonth() + 1 < 10) ? `0${timeClient.getMonth() + 1}` : timeClient.getMonth() + 1;
  const yy = timeClient.getFullYear() % 100;

  return Number(`${yy}${mm}${dd}`);
}

/**
 * @description Рассчитаем разницу в днях между двумя датами day1-day2
 * @param  {number} day1 дата в формате yymmdd
 * @param  {number} day2 дата в формате yymmdd
 * @returns {number} разница в днях
 */
export function deltaDay(day1, day2) {
  const d1 = new Date(2000 + Math.floor(day1 / 10000), Math.floor((day1 % 10000) / 100) - 1, day1 % 100);
  const d2 = new Date(2000 + Math.floor(day2 / 10000), Math.floor((day2 % 10000) / 100) - 1, day2 % 100);
  return (d1 - d2) / 86400000;
}

