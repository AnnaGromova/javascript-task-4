'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    function addNotification(event, context, handler) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push({ context, handler });
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
                subscriber.handler.call(subscriber.context);
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
