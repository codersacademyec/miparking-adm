angular.module('MiParking.services', [])
    .factory('AccountService', ["$q", AccountService])

function AccountService($q) {
    return {
        currentUser: function() {
            var def = $q.defer();
            Stamplay.User.currentUser()
                .then(function(response) {
                    if (response.user === undefined) {
                        def.resolve(false);
                    } else {
                        def.resolve(response.user);
                    }
                }, function(error) {
                    def.reject();
                });
            return def.promise;
        }
    };
}