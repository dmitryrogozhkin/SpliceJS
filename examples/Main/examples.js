
function BasicApplication(){
	_.load(['../examples/BasicApplication/basicapplication.js'],function(){
		new UserApplications.BasicApplication().exitApplication = function(){
			_.Doc.display(new UserApplications.MainMenu());
		};
	});
}



function ControlsAndBindings(){
	_.load(['../examples/ControlsAndBindings/controlsandbindings.js'],function(){
		new UserApplications.ControlsAndBindings();
	});
}
