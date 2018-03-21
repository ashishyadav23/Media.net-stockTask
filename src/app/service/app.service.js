(function () {
    'use strict';
    angular.module('mediaNet')
        .service('AppService', AppService);
    /**@ngInject */
    function AppService($websocket, $rootScope, $window) {
        var collection = getLocalStorage();
        var dataStream = $websocket('ws://stocks.mnet.website');
        dataStream.onMessage(function (message) {
            console.log(message);
            $rootScope.$broadcast('mesageArrived', formatData(JSON.parse(message.data)));
        });

        function getColor(newPrice, oldPrice) {
            if (newPrice > oldPrice) {
                return "green";
            } else if (newPrice < oldPrice) {
                return "red";
            } else {
                return "white";
            }
        }

        function pushData(obj) {
            collection.push({
                [obj.name]: {
                    "oldValue": obj.value,
                    "newValue": obj.value,
                    "color": getColor(obj.value, obj.value),
                    "update": new Date().getTime()
                }
            });
            // console.log(obj);
        }

        function formatCollections(list) {
            var obj = {
                "name": list[0],
                "value": list[1]
            };
            if (collection.length == 0) {
                pushData(obj)
            } else {
                for (var pos = 0; pos < collection.length; pos++) {
                    var item = collection[pos];
                    // console.log(item.hasOwnProperty(obj.name));
                    var existObj = checkExisting(obj.name);
                    if (existObj.status) {
                        collection[existObj.pos].newValue = obj.value;
                        collection[existObj.pos].color = getColor(obj.value, collection[existObj.pos].oldValue);
                        collection[existObj.pos].update = new Date().getTime();
                    } else {
                        pushData(obj);
                    }
                }
            }
            console.log("Collection formateted", collection);

        }

        function checkExisting(value) {
            for (var pos = 0; pos < collection.length; pos++) {
                var item = collection[pos];
                if (item.hasOwnProperty(value)) {
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
            for (var pos = 0; pos < stockList.length; pos++) {
                formatCollections(stockList[pos]);
            }
        }

        function setLocalStorage() {
            $window.localStorage.setItem('stocks', collection);
        }
        function getLocalStorage() {
            return $window.localStorage.getItem('stocks') ? $window.localStorage.getItem('stocks') : [];
        }
    }
})();