(function(){

    var cDataObj = {}
    window.cData = {
        get:function(key){
            return cDataObj[key];
        },
        set:function(key,value){
            cDataObj[key] = value;
        }
    }

    window.CO = {

    }

})();