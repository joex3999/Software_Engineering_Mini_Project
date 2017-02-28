angular.module('userControllers',[])

.controller('regCtrl',function($http,$location,$timeout,User){
	console.log("testing new module");
	var app = this ;
	this.regUser = function(regData){
		app.errorMsg = false ;
		app.loading = true ;
		User.create(app.regData).then(function(data){ // data ks the data of the response 
		 
			if(data.data.success){
				app.loading = false ;
				app.successMsg = data.data.message;
				$timeout(function(){
					$location.path('/');
				},2000)
				
			}else{
				app.loading = false ;
					app.errorMsg = data.data.message;
			
			}
		});
	}
})