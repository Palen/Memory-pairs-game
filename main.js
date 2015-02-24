
cc.game.onStart = function(){
	cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
	cc.director.runScene(new gameScene());
}
cc.game.run();