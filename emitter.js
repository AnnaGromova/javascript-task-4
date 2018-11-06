'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    function addNotification(event, context, handler,
        timesAndFrequency = { times: Infinity, frequency: 1 }) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push({ context, handler, times: timesAndFrequency.times,
            frequency: timesAndFrequency.frequency, count: 0 });
    }

    function deleteNotification(event, context) {
        Object.keys(events).filter(key =>
            key === event || key.startsWith(event + '.'))
            .forEach(key => {
                events[key] = events[key]
                    .filter(subscriber => subscriber.context !== context);
            });
    }

    function emitNotification(event) {
        if (events[event]) {
            events[event].forEach(subscriber => {
                if (subscriber.times && subscriber.count % subscriber.frequency === 0) {
                    subscriber.handler.call(subscriber.context);
                    subscriber.times--;
                }
                subscriber.count++;
            });
        }
        let lastIndexOfPoint = event.lastIndexOf('.');
        if (lastIndexOfPoint !== -1) {
            emitNotification(event.slice(0, lastIndexOfPoint));
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Any}
         */
        on: function (event, context, handler) {
            addNotification(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Any}
         */
        off: function (event, context) {
            deleteNotification(event, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Any}
         */
        emit: function (event) {
            emitNotification(event);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Any}
         */
        several: function (event, context, handler, times) {
            addNotification(event, context, handler, { times: times, frequency: 1 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Any}
         */
        through: function (event, context, handler, frequency) {
            addNotification(event, context, handler, { times: Infinity, frequency: frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
