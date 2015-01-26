app.controller('SearchCtrl', ['$scope', '$stateParams', '$state', '$timeout', 'Backend',
 function ($scope, $stateParams, $state, $timeout, Backend) {
    var getType = function(unformattedType){
        var nameKey = {
            'street_name' : 'street',
            'address' : 'address',
            'neighborhood' : 'neighborhood',
            'owner_name' : 'owner',
            'civicaddressid' : 'address',
            'pinnum' : 'pin'
        };
        return nameKey[unformattedType];
    };


    $scope.searchText = '';

    $scope.errorMessage = {
        show : false,
        message : 'We had trouble locating that location. Please try to enter a location again.'
    };
    $scope.helperMessage = {
        show : false,
        message : 'Please choose one of the options below.'
    };



    //Geocodes the search results     
    $scope.doSearch = function(searchText, event){
        var offset = $('#inputSearch').offset().top - 20;
        $("html, body").animate({'scrollTop' : offset + "px"});
        //we don't want to start search until the user has input 3 characters
        if(searchText.length < 3){
            return;
        }

        //if the user hits enter while after text search text
        //show a message that tells them to click on one of the results below
        if(event.keyCode === 13 && searchText !== ''){
            $scope.helperMessage.show = true;
            $timeout(function() {
                $scope.helperMessage.show = false;
            }, 2000);
        }

        //Search usign searchText
        Backend.compositeSearch(searchText)
            .then(function(searchResults){
                $scope.searchGroups = searchResults; 
            });
    };

    $scope.unFocus = function(){
        $timeout(function() {
        $scope.searchGroups = []; 
        }, 100); 
    };



    $scope.detailedSelection = [];

    //groupOrderArray.splice(groupOrderPosition, 0, data.candidates[i].attributes.Loc_name);

    $scope.goToTopics = function(candidate, event){
        console.log(candidate);
        var label = ""
        for (var i = 0; i < candidate.label.length; i++) {
            if(candidate.label.charAt(i) !== '&'){
                label = label + candidate.label.charAt(i);
            } 
        }
        if(candidate.type === 'civicaddressid'){
            candidate.type = "address";
        }

        $state.go('main.topics.list', {'searchtext' : label, 'searchby' : candidate.type, 'id' : candidate.id});
    };




}]);