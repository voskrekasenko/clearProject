(function(){
	"use strict"

	angular
		.module('app')
		.controller('appCtrl', appCtrl)

		function appCtrl () {
			var vm = this;
			console.log('hello');
		}
}());