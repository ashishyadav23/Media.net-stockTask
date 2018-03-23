(function () {
    'use strict';
    angular.module('mediaNet')
        .service('AppService', AppService);
    /**@ngInject */
    function AppService($websocket, $rootScope, $window) {
        var collection = getLocalStorage();
        // $rootScope.$broadcast('mesageArrived', collection);
        var dataStream = $websocket('ws://stocks.mnet.website');
        dataStream.onMessage(function (message) {
            // setTimeout(function () {
            formatData(JSON.parse(message.data));
            // }, 1000 * 60)

        });

        function getColor(newPrice, oldPrice) {
            if (newPrice == oldPrice) {
                return "white";
            } else if (newPrice > oldPrice) {
                return "green";
            } else if (newPrice < oldPrice) {
                return "red";
            } else {
                return "white";
            }
        }

        function pushData(obj) {
            collection.push({
                "name": obj.name,
                "oldValue": obj.value,
                "newValue": obj.value,
                "color": getColor(obj.value, obj.value),
                "update": new Date().getTime()
            });
        }

        function formatCollections(list) {
            var obj = {
                "name": list[0],
                "value": list[1]
            };
            if (collection.length == 0) {
                pushData(obj)
            } else {
                collection.map(function (item, key) {
                    var existObj = checkExisting(obj.name);
                    if (existObj.status) {
                        if (obj.value !== collection[existObj.pos].newValue) {
                            collection[existObj.pos].newValue = obj.value;
                            collection[existObj.pos].color = getColor(obj.value, collection[existObj.pos].oldValue);
                            collection[existObj.pos].update = new Date().getTime();
                            collection[existObj.pos].name = obj.name;
                        }

                    } else {
                        pushData(obj);
                    }
                })
                // for (var pos = 0; pos < collection.length; pos++) {
                //     var item = collection[pos];
                //     var existObj = checkExisting(obj.name);
                //     if (existObj.status) {
                //         if (obj.value !== collection[existObj.pos].newValue) {
                //             collection[existObj.pos].newValue = obj.value;
                //             collection[existObj.pos].color = getColor(obj.value, collection[existObj.pos].oldValue);
                //             collection[existObj.pos].update = new Date().getTime();
                //             collection[existObj.pos].name = obj.name;
                //         }

                //     } else {
                //         pushData(obj);
                //     }
                // }
            }
        }

        function checkExisting(value) {
            for (var pos = 0; pos < collection.length; pos++) {
                var item = collection[pos];
                if (item.hasOwnProperty("name") && item.name === value) {
                    return {
                        "pos": pos,
                        "status": true
                    }
                }
            }
            return {
                "status": false
            }
        }

        function formatData(stockList) {

            stockList.map(function (value, key) {
                formatCollections(value);
                setLocalStorage();
                $rootScope.$broadcast('mesageArrived', collection);
            });
        }

        function setLocalStorage() {
            $window.localStorage.setItem('stocks', JSON.stringify(collection));
        }
        function getLocalStorage() {
            // return [];
            return $window.localStorage.getItem('stocks') ? JSON.parse($window.localStorage.getItem('stocks')) : [];
        }
        return {
            collection: collection
        };
    }
})();