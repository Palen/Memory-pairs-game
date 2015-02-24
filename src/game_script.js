var gameArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
var pickedTiles = [], gameLayer;
var scoreText;
var moves = 0;

/**
 * Returns a shuffled array
 * @param o {Array}
 * @returns {Array}
 */
function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/**
 * Main scene view
 * @type {Function}
 */
var GameScene = cc.Scene.extend({
    onEnter: function () {
        gameArray = shuffle(gameArray);
        this._super();
        gameLayer = new Game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

/**
 * The only one layer with game logic
 * @type {Function}
 */
var Game = cc.Layer.extend({
    init: function () {
        this._super();
        var gradient = cc.LayerGradient.create(cc.color(0, 0, 0, 255), cc.color(0x46, 0x82, 0xB4, 255));
        scoreText = cc.LabelTTF.create("Moves: 0", "Arial", 32, cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(gradient);
        this.addChild(scoreText);
        scoreText.setPosition(90, 50);
        for (var i = 0; i < 16; i++) {
            var tile = new MemoryTile();
            tile.pictureValue = gameArray[i];
            this.addChild(tile, 0);
            tile.setPosition(49 + i % 4 * 74, 400 - Math.floor(i / 4) * 74);
        }
    }
});

/**
 * Tile layer with cover image
 * @type {Function}
 */
var MemoryTile = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile("assets/cover.png");
        cc.eventManager.addListener(listener.clone(), this);
    }
});

/**
 * Listener of touch event
 * @type {cc.EventListener}
 */
var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
        if (pickedTiles.length < 2) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
                if (pickedTiles.indexOf(target) == -1) {
                    target.initWithFile("assets/tile_" + target.pictureValue + ".png");
                    pickedTiles.push(target);
                    if (pickedTiles.length == 2) {
                        checkTiles();
                    }
                }
            }
        }
    }
});

/**
 * Check if the pair of tiles have the same value.
 */
var checkTiles = function () {
    moves++;
    scoreText.setString("Moves: " + moves);
    setTimeout(function () {
        if (pickedTiles[0].pictureValue != pickedTiles[1].pictureValue) {
            pickedTiles[0].initWithFile("assets/cover.png");
            pickedTiles[1].initWithFile("assets/cover.png");
        } else {
            gameLayer.removeChild(pickedTiles[0]);
            gameLayer.removeChild(pickedTiles[1]);
        }
        pickedTiles = [];
    }, 2000)
};
