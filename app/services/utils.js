angular.module('muni.utils', [])

.service('utils', [function() {
  // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  this.uniq = function(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  };

  // http://snipplr.com/view/36012/javascript-natural-sort/
  this.naturalSort = function(as, bs){
    var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
    a = String(as).toLowerCase().match(rx);
    b = String(bs).toLowerCase().match(rx);

    while(a.length && b.length){
      a1 = a.shift();
      b1 = b.shift();
      if(rd.test(a1) || rd.test(b1)){
        if(!rd.test(a1)) return 1;
        if(!rd.test(b1)) return -1;
        if(a1!= b1) return a1-b1;
      } else if(a1!= b1) return a1> b1? 1: -1;
    }
    return a.length- b.length;
  };
}])
