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

    function addNotification(event, subevent, context, handler) {
        if (!events[event + subevent]) {
            events[event + subevent] = [];
        }
        events[event + subevent].push({ context, handler });
    }

    function deleteNotification(event, subevent, context) {
        Object.keys(events).filter(key =>
            key === event + subevent || subevent === '' && key.split('.')[0] === event)
            .forEach(key => {
                events[key] = events[key]
                    .filter(subscriber => subscriber.context !== context);
            });
    }

    function emitNotification(event, subevent) {
        if (events[event + subevent] && subevent !== '') {
            events[event + subevent].forEach(subscriber => {
                subscriber.handler.call(subscriber.context);
            });
        }
        if (events[event]) {
            events[event].forEach(subscriber => {
                subscriber.handler.call(subscriber.context);
            });
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
            let eventAndSubevent = event.split('.');
            if (eventAndSubevent[1]) {
                eventAndSubevent[1] = '.' + eventAndSubevent;
            } else {
                eventAndSubevent[1] = '';
            }
            addNotification(eventAndSubevent[0], eventAndSubevent[1], context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Any}
         */
        off: function (event, context) {
            let eventAndSubevent = event.split('.');
            if (eventAndSubevent[1]) {
                eventAndSubevent[1] = '.' + eventAndSubevent;
            } else {
                eventAndSubevent[1] = '';
            }
            deleteNotification(eventAndSubevent[0], eventAndSubevent[1], context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Any}
         */
        emit: function (event) {
            let eventAndSubevent = event.split('.');
            if (eventAndSubevent[1]) {
                eventAndSubevent[1] = '.' + eventAndSubevent;
            } else {
                eventAndSubevent[1] = '';
            }
            emitNotification(eventAndSubevent[0], eventAndSubevent[1]);

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
