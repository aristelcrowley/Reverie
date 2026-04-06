/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/gameover/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc Provides more flexibility to the Game Over scene
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.3.0
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.10.0
 * ----------------------------------------------------------------------------
 * Description: Provides the option to change the Game Over scene image/music
 * based on a variable, and also allows you to add a command window to the
 * Game Over scene which the player can use to quickly get back into the game.
 * ----------------------------------------------------------------------------
 * Documentation:
 * To change the game over image or music, before game over scene is entered
 * change the variable set up in the parameters for the image/music to a
 * number corresponding with an entry in the image/music file list parameter.
 *
 * For example, if you want to play the second music and third image in the
 * music and image file parameter, set the music variable to 2 and image
 * variable to 3.
 * -------------------------Command Symbols------------------------------------
 * There are two command symbols that have built-in behavior when used, and
 * will ignore any JS you have for them. These are:
 *
 * title - Will go to the title scene
 * continue - Will go to the load game scene
 * -------------------------Plugin Commands------------------------------------
 * This plugin does not support plugin commands.
 * ------------------------------Saved Games-----------------------------------
 * This plugin is fully compatible with saved games. This means you can:
 *
 * ✓ Add this plugin to a saved game and it will work as expected
 * ✓ Change any plugin params and changes will be reflected in saved games
 * ✓ Remove the plugin with no issue to save data
 * -----------------------------Filename---------------------------------------
 * The filename for this plugin MUST remain CGMZ_GameOver.js
 * This is what it comes as when downloaded. The filename is used to load
 * parameters and execute plugin commands. If you change it, things will begin
 * behaving incorrectly and your game will probably crash. Please do not
 * rename the js file.
 * --------------------------Latest Version------------------------------------
 * Hi all, this latest version adds pictures you can show that will function
 * as commands. This can help get your game away from the standard RPG Maker
 * look with the command window. Pictures can have an inactive and active
 * state, which is applied when that picture is hovered or selected. Pictures
 * work with all control types, including touch, keyboard, and gamepad.
 *
 * To use pictures in place of your command window, set the Number of Commands
 * parameter to 0 to hide the command window.
 * 
 * Version 1.3.0
 * - Added pictures that can take the place of the command window
 *
 * @param Custom Images and Music Options
 * 
 * @param GameOver Image Variable
 * @type variable
 * @desc Determines the variable to change gameover image
 * @default 1
 * @parent Custom Images and Music Options
 * 
 * @param GameOver Music Variable
 * @type variable
 * @desc Determines the variable to change gameover music
 * @default 2
 * @parent Custom Images and Music Options
 * 
 * @param GameOver Video Variable
 * @type variable
 * @desc Determines the variable to change gameover video
 * @default 1
 * @parent Custom Images and Music Options
 *
 * @param Images
 * @type file[]
 * @dir img/
 * @default []
 * @desc Images to show in the game over scene.
 * @parent Custom Images and Music Options
 *
 * @param Videos
 * @type file[]
 * @dir movies/
 * @default []
 * @desc Videos to show in the game over scene.
 * @parent Custom Images and Music Options
 *
 * @param Music
 * @type file[]
 * @dir audio/
 * @default []
 * @desc Music to play in the game over scene.
 * @parent Custom Images and Music Options
 * 
 * @param Volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @desc The volume of the music
 * @parent Custom Images and Music Options
 * 
 * @param Pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @desc The pitch of the music
 * @parent Custom Images and Music Options
 * 
 * @param Pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * @desc The pan of the music
 * @parent Custom Images and Music Options
 *
 * @param Command Window Options
 *
 * @param Show Command Window
 * @type boolean
 * @desc Determines whether to show the command window or not
 * @default true
 * @parent Command Window Options
 *
 * @param Number of Commands
 * @type number
 * @desc Number of commands to display in the command window before scrolling
 * @default 2
 * @parent Command Window Options
 *
 * @param Command Alignment
 * @type select
 * @option left
 * @option center
 * @option right
 * @desc Alignment of the command text in the command window
 * @default center
 * @parent Command Window Options
 *
 * @param Icon Alignment
 * @type select
 * @option left
 * @option right
 * @desc Alignment of the command icon in the command window
 * @default left
 * @parent Command Window Options
 *
 * @param Command Width
 * @type number
 * @desc Width of the command window, as a percentage of total screen width. 0 = default width
 * @default 0
 * @parent Command Window Options
 *
 * @param X Offset
 * @type number
 * @desc Amount of pixels to add to the x coordinate of the window
 * @default 0
 * @min -9999
 * @parent Command Window Options
 *
 * @param Y Offset
 * @type number
 * @desc Amount of pixels to add to the y coordinate of the window
 * @default 0
 * @min -9999
 * @parent Command Window Options
 *
 * @param Commands
 * @type struct<Handler>[]
 * @desc Set up commands for the command window here
 * @default []
 * @parent Command Window Options
 *
 * @param Picture Setup
 *
 * @param Pictures
 * @parent Picture Setup
 * @type struct<Picture>[]
 * @desc Selectable images that can be used in place of the command window
 * @default []
 *
 * @param Picture Base X
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc The base X of all pictures
 *
 * @param Picture Base Y
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc The base Y of all pictures
 *
 * @param Picture Add X
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount added to picture X after each image
 *
 * @param Picture Add Y
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount added to picture Y after each image
 *
 * @param Integrations
 *
 * @param Command Window Settings
 * @parent Integrations
 * @desc [CGMZ] Window Settings preset to use for the game over command window
 *
 * @param Command Window Bg
 * @parent Integrations
 * @desc [CGMZ] Window Backgrounds preset to use for the game over command window
*/
/*~struct~Handler:
 * @param Command Name
 * @desc Name of the command to display in the command window.
 *
 * @param Icon
 * @type icon
 * @default 0
 * @desc An icon to show for the command, if 0 will not show any icon
 *
 * @param Command Symbol
 * @desc This symbol is used internally to recognize the command.
 * Special meaning for original commands (see documentation).
 *
 * @param JS Command
 * @type multiline_string
 * @desc JavaScript to run when command is selected.
 *
 * @param JS Enable Condition
 * @type multiline_string
 * @default return true;
 * @desc JavaScript to run to determine if the command is enabled
 *
 * @param JS Show Condition
 * @type multiline_string
 * @default return true;
 * @desc JavaScript to run to determine if the command is shown
 *
 * @param Background Image
 * @type file
 * @dir img
 * @desc A background image to use for the command. Blank = default black rectangle
 *
 * @param Background Image X
 * @type number
 * @default 0
 * @min 0
 * @desc The x coordinate to start the background image from the source image (upper left corner)
 *
 * @param Background Image Y
 * @type number
 * @default 0
 * @min 0
 * @desc The y coordinate to start the background image from the source image (upper left corner)
*/
/*~struct~Picture:
 * @param Command Symbol
 * @desc The command symbol this picture will activate
 *
 * @param Inactive Image
 * @type file
 * @dir img
 * @desc Image file to use when not active
 *
 * @param Active Image
 * @type file
 * @dir img
 * @desc Image file to use when active
 *
 * @param X Offset
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount of pixels to offset the x for this picture
 *
 * @param Y Offset
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount of pixels to offset the y for this picture
*/
/*:es
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/gameover/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc Proporciona más flexibilidad a la escena Game Over (Fin del Juego).
 * @help
 * ============================================================================
 * Para términos y condiciones de uso de este pluging en tu juego, por favor
 * visita:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * ¡Conviértete en un Patrocinador para obtener acceso a los plugings beta y
 * alfa, ademas de otras cosas geniales!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Versión: 1.3.0
 * ----------------------------------------------------------------------------
 * Compatibilidad: Sólo probado con mis CGMZ plugins.
 * Hecho para RPG Maker MZ 1.10.0
 * ----------------------------------------------------------------------------
 * Descripción: Brinda la opción de cambiar la imagen/música de la escena de 
 * Game Over en función de una variable, y también le permite agregar una 
 * ventana	de comando a la escena de Game Over que el jugador puede usar para
 * volver  rápidamente al juego.
 * ----------------------------------------------------------------------------
 * Documentación:
 * Este plugin no admite comandos de plugin.
 *
 * Para cambiar la imagen o la música de Game Over, antes de ingresar a la
 * escena  de Game Over, cambia la configuración de la variable en los
 * parámetros para la  imagen/música a un número correspondiente con una
 * entrada en el parámetro de la  lista de archivos de imagen/música.
 *
 * Por ejemplo, si deseas reproducir la segunda música y la tercera imagen en 
 * el parámetro de archivo de música e imagen, establezca la variable de
 * música en 2 y la variable de imagen en 3.
 * --------------------------Latest Version------------------------------------
 * Hi all, this latest version adds pictures you can show that will function
 * as commands. This can help get your game away from the standard RPG Maker
 * look with the command window. Pictures can have an inactive and active
 * state, which is applied when that picture is hovered or selected. Pictures
 * work with all control types, including touch, keyboard, and gamepad.
 *
 * To use pictures in place of your command window, set the Number of Commands
 * parameter to 0 to hide the command window.
 * 
 * Version 1.3.0
 * - Added pictures that can take the place of the command window
 *
 * @param Custom Images and Music Options
 * @text Imágenes personalizadas y opciones de música
 * 
 * @param GameOver Image Variable
 * @text Variable de imagen de Game Over
 * @type variable
 * @desc Determina la variable para cambiar la imagen del juego.
 * @default 1
 * @parent Custom Images and Music Options
 * 
 * @param GameOver Music Variable
 * @text Variable musical de GameOver
 * @type variable
 * @desc Determina la variable para cambiar la música del juego.
 * @default 2
 * @parent Custom Images and Music Options
 * 
 * @param GameOver Video Variable
 * @type variable
 * @desc Determines the variable to change gameover video
 * @default 1
 * @parent Custom Images and Music Options
 *
 * @param Images
 * @text Imágenes
 * @type file[]
 * @dir img/
 * @default []
 * @desc Imágenes para mostrar en la escena del fin del juego.
 * @parent Custom Images and Music Options
 *
 * @param Videos
 * @type file[]
 * @dir movies/
 * @default []
 * @desc Videos to show in the game over scene.
 * @parent Custom Images and Music Options
 *
 * @param Music
 * @text Música
 * @type file[]
 * @dir audio/
 * @default []
 * @desc Música para tocar en la escena del fin del juego.
 * @parent Custom Images and Music Options
 * 
 * @param Volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @desc The volume of the music
 * @parent Custom Images and Music Options
 * 
 * @param Pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @desc The pitch of the music
 * @parent Custom Images and Music Options
 * 
 * @param Pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * @desc The pan of the music
 * @parent Custom Images and Music Options
 *
 * @param Command Window Options
 * @text Opciones de la ventana de comandos
 *
 * @param Show Command Window
 * @text Mostrar ventana de comandos
 * @type boolean
 * @desc Determina si mostrar la ventana de comandos o no.
 * @default true
 * @parent Command Window Options
 *
 * @param Number of Commands
 * @type number
 * @desc Number of commands to display in the command window before scrolling
 * @default 2
 * @parent Command Window Options
 *
 * @param Command Alignment
 * @type select
 * @option left
 * @option center
 * @option right
 * @desc Alignment of the command text in the command window
 * @default center
 * @parent Command Window Options
 *
 * @param Icon Alignment
 * @type select
 * @option left
 * @option right
 * @desc Alignment of the command icon in the command window
 * @default left
 * @parent Command Window Options
 *
 * @param Command Width
 * @type number
 * @desc Width of the command window, as a percentage of total screen width. 0 = default width
 * @default 0
 * @parent Command Window Options
 *
 * @param X Offset
 * @type number
 * @desc Amount of pixels to add to the x coordinate of the window
 * @default 0
 * @min -9999
 * @parent Command Window Options
 *
 * @param Y Offset
 * @type number
 * @desc Amount of pixels to add to the y coordinate of the window
 * @default 0
 * @min -9999
 * @parent Command Window Options
 *
 * @param Commands
 * @type struct<Handler>[]
 * @desc Set up commands for the command window here
 * @default []
 * @parent Command Window Options
 *
 * @param Picture Setup
 *
 * @param Pictures
 * @parent Picture Setup
 * @type struct<Picture>[]
 * @desc Selectable images that can be used in place of the command window
 * @default []
 *
 * @param Picture Base X
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc The base X of all pictures
 *
 * @param Picture Base Y
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc The base Y of all pictures
 *
 * @param Picture Add X
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount added to picture X after each image
 *
 * @param Picture Add Y
 * @parent Picture Setup
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount added to picture Y after each image
 *
 * @param Integrations
 *
 * @param Command Window Settings
 * @parent Integrations
 * @desc [CGMZ] Window Settings preset to use for the game over command window
 *
 * @param Command Window Bg
 * @parent Integrations
 * @desc [CGMZ] Window Backgrounds preset to use for the game over command window
*/
/*~struct~Handler:es
 * @param Command Name
 * @desc Name of the command to display in the command window.
 *
 * @param Icon
 * @type icon
 * @default 0
 * @desc An icon to show for the command, if 0 will not show any icon
 *
 * @param Command Symbol
 * @desc This symbol is used internally to recognize the command.
 * Special meaning for original commands (see documentation).
 *
 * @param JS Command
 * @type multiline_string
 * @desc JavaScript to run when command is selected.
 *
 * @param JS Enable Condition
 * @type multiline_string
 * @default return true;
 * @desc JavaScript to run to determine if the command is enabled
 *
 * @param JS Show Condition
 * @type multiline_string
 * @default return true;
 * @desc JavaScript to run to determine if the command is shown
 *
 * @param Background Image
 * @type file
 * @dir img
 * @desc A background image to use for the command. Blank = default black rectangle
 *
 * @param Background Image X
 * @type number
 * @default 0
 * @min 0
 * @desc The x coordinate to start the background image from the source image (upper left corner)
 *
 * @param Background Image Y
 * @type number
 * @default 0
 * @min 0
 * @desc The y coordinate to start the background image from the source image (upper left corner)
*/
/*~struct~Picture:es
 * @param Command Symbol
 * @desc The command symbol this picture will activate
 *
 * @param Inactive Image
 * @type file
 * @dir img
 * @desc Image file to use when not active
 *
 * @param Active Image
 * @type file
 * @dir img
 * @desc Image file to use when active
 *
 * @param X Offset
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount of pixels to offset the x for this picture
 *
 * @param Y Offset
 * @type number
 * @default 0
 * @min -9999
 * @desc Amount of pixels to offset the y for this picture
*/
Imported.CGMZ_GameOver = true;
CGMZ.Versions["Game Over"] = "1.3.0";
CGMZ.GameOver = {};
CGMZ.GameOver.parameters = PluginManager.parameters('CGMZ_GameOver');
CGMZ.GameOver.ImageVariable = Number(CGMZ.GameOver.parameters["GameOver Image Variable"]);
CGMZ.GameOver.MusicVariable = Number(CGMZ.GameOver.parameters["GameOver Music Variable"]);
CGMZ.GameOver.VideoVariable = Number(CGMZ.GameOver.parameters["GameOver Video Variable"]);
CGMZ.GameOver.NumberOfCommands = Number(CGMZ.GameOver.parameters["Number of Commands"]);
CGMZ.GameOver.Volume = Number(CGMZ.GameOver.parameters["Volume"]);
CGMZ.GameOver.Pitch = Number(CGMZ.GameOver.parameters["Pitch"]);
CGMZ.GameOver.Pan = Number(CGMZ.GameOver.parameters["Pan"]);
CGMZ.GameOver.XOffset = Number(CGMZ.GameOver.parameters["X Offset"]);
CGMZ.GameOver.YOffset = Number(CGMZ.GameOver.parameters["Y Offset"]);
CGMZ.GameOver.CommandWidth = Number(CGMZ.GameOver.parameters["Command Width"]);
CGMZ.GameOver.PictureBaseX = Number(CGMZ.GameOver.parameters["Picture Base X"]);
CGMZ.GameOver.PictureBaseY = Number(CGMZ.GameOver.parameters["Picture Base Y"]);
CGMZ.GameOver.PictureAddX = Number(CGMZ.GameOver.parameters["Picture Add X"]);
CGMZ.GameOver.PictureAddY = Number(CGMZ.GameOver.parameters["Picture Add Y"]);
CGMZ.GameOver.Images = CGMZ_Utils.parseJSON(CGMZ.GameOver.parameters["Images"], [], "[CGMZ] GameOver", "Your Images parameter had invalid JSON and could not be read.");
CGMZ.GameOver.Music = CGMZ_Utils.parseJSON(CGMZ.GameOver.parameters["Music"], [], "[CGMZ] GameOver", "Your Music parameter had invalid JSON and could not be read.");
CGMZ.GameOver.Videos = CGMZ_Utils.parseJSON(CGMZ.GameOver.parameters["Videos"], [], "[CGMZ] GameOver", "Your Videos parameter had invalid JSON and could not be read.");
CGMZ.GameOver.ShowCommandWindow = (CGMZ.GameOver.parameters["Show Command Window"] === "true");
CGMZ.GameOver.CommandAlignment = CGMZ.GameOver.parameters["Command Alignment"];
CGMZ.GameOver.IconAlignment = CGMZ.GameOver.parameters["Icon Alignment"];
CGMZ.GameOver.CommandWindowSettings = CGMZ.GameOver.parameters["Command Window Settings"];
CGMZ.GameOver.CommandWindowBackground = CGMZ.GameOver.parameters["Command Window Bg"];
CGMZ.GameOver.Commands = CGMZ_Utils.parseJSON(CGMZ.GameOver.parameters["Commands"], [], "[CGMZ] GameOver", "Your Commands parameter had invalid JSON and could not be read.").map((command) => {
	const cmdP = CGMZ_Utils.parseJSON(command, null, "[CGMZ] GameOver", "One of your game over commands had invalid JSON and could not be read.");
	if(!cmdP) return null;
	const cmd = {};
	cmd.icon = Number(cmdP.Icon);
	cmd.backgroundImage = cmdP["Background Image"];
	cmd.backImgX = Number(cmdP["Background Image X"]);
	cmd.backImgY = Number(cmdP["Background Image Y"]);
	cmd.symbol = cmdP["Command Symbol"] || Math.random().toString(36);
	cmd.name = cmdP["Command Name"];
	cmd.js = cmdP["JS Command"];
	cmd.jsShow = cmdP["JS Show Condition"];
	cmd.jsEnable = cmdP["JS Enable Condition"];
	return cmd;
}).filter(x => !!x);
CGMZ.GameOver.Pictures = CGMZ_Utils.parseJSON(CGMZ.GameOver.parameters["Pictures"], [], "[CGMZ] Game Over Window", "Your Pictures parameter had invalid JSON and could not be read.").map(picJSON => {;
	const pic = CGMZ_Utils.parseJSON(picJSON, null, "[CGMZ] Game Over", "One of your game over command pictures had invalid JSON and could not be read.")
	if(!pic) return null;
	return {
		symbol: pic["Command Symbol"],
		xOffset: Number(pic["X Offset"]),
		yOffset: Number(pic["Y Offset"]),
		imgActive: CGMZ_Utils.getImageData(pic["Active Image"], "img"),
		imgInactive: CGMZ_Utils.getImageData(pic["Inactive Image"], "img")
	};
}).filter(x => !!x);
//=============================================================================
// Scene_Gameover
//-----------------------------------------------------------------------------
// Show different images/music/video based on variable.
//=============================================================================
const alias_CGMZGameOver_SceneGameOver_initialize = Scene_Gameover.prototype.initialize;
Scene_Gameover.prototype.initialize = function() {
    alias_CGMZGameOver_SceneGameOver_initialize.call(this);
	this._cgmz_hasVideo = false;
	this._cgmz_currentCommand = "";
	this._cgmz_commandPictures = [];
};
//-----------------------------------------------------------------------------
// Play different music based on variable value.
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_playGameoverMusic = Scene_Gameover.prototype.playGameoverMusic;
Scene_Gameover.prototype.playGameoverMusic = function() {
	if($gameVariables.value(CGMZ.GameOver.MusicVariable) <= 0) {
		alias_CGMZ_GameOver_playGameoverMusic.call(this);
	}
	else {
		if($gameVariables.value(CGMZ.GameOver.MusicVariable) > CGMZ.GameOver.Music.length) {
			alias_CGMZ_GameOver_playGameoverMusic.call(this);
			const script = "[CGMZ] GameOver";
			const error = "Variable value out of range";
			const suggestion = "Check to make sure your GameOver Music Variable has intended value";
			CGMZ_Utils.reportError(error, script, suggestion);
		} else {
			this.CGMZ_GameOver_playSound();
		}
	}
};
//-----------------------------------------------------------------------------
// Play correct sound based on variable (me, se, bgm, bgs).
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_playSound = function() {
	const file = CGMZ.GameOver.Music[$gameVariables.value(CGMZ.GameOver.MusicVariable) - 1].split("/");
	const type = file.shift();
	const sound = {name: file.join("/"), pan: CGMZ.GameOver.Pan, pitch: CGMZ.GameOver.Pitch, volume: CGMZ.GameOver.Volume};
	switch(type) {
		case "me":
			AudioManager.stopBgm();
			AudioManager.stopBgs();
			AudioManager.playMe(sound);
			break;
		case "bgm":
			AudioManager.stopBgs();
			AudioManager.playBgm(sound);
			break;
		case "bgs":
			AudioManager.stopBgm();
			AudioManager.playBgs(sound);
			break;
		case "se":
			AudioManager.stopBgm();
			AudioManager.stopBgs();
			AudioManager.playSe(sound);
	}
};
//-----------------------------------------------------------------------------
// Show different Image based on variable value.
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_createBackground = Scene_Gameover.prototype.createBackground;
Scene_Gameover.prototype.createBackground = function() {
	if(CGMZ.GameOver.VideoVariable) {
		this._cgmz_videoSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
		this.addChild(this._cgmz_videoSprite);
		const videoIndex = $gameVariables.value(CGMZ.GameOver.VideoVariable) - 1;
		const videoFile = CGMZ.GameOver.Videos[videoIndex];
		if(videoFile) {
			this._cgmz_hasVideo = true;
			CGMZ_Video.play(videoFile);
			CGMZ_Video.setVolume(0);
		}
	}
	if($gameVariables.value(CGMZ.GameOver.ImageVariable) <= 0) {
		alias_CGMZ_GameOver_createBackground.call(this);
	} else {
		if($gameVariables.value(CGMZ.GameOver.ImageVariable) > CGMZ.GameOver.Images.length) {
			alias_CGMZ_GameOver_createBackground.call(this);
			const script = "[CGMZ] GameOver";
			const error = "Variable value out of range";
			const suggestion = "Check to make sure your GameOver Image Variable has intended value";
			CGMZ_Utils.reportError(error, script, suggestion);
		} else {
			const imgData = CGMZ_Utils.getImageData(CGMZ.GameOver.Images[$gameVariables.value(CGMZ.GameOver.ImageVariable) - 1], "img");
			this._backSprite = new Sprite();
			this._backSprite.bitmap = ImageManager.loadBitmap(imgData.folder, imgData.filename);
			this.addChild(this._backSprite);
		}
	}
};
//-----------------------------------------------------------------------------
// Also create command window if option enabled
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_create = Scene_Gameover.prototype.create;
Scene_Gameover.prototype.create = function() {
	alias_CGMZ_GameOver_create.call(this);
	if(CGMZ.GameOver.ShowCommandWindow) {
		this.createWindowLayer();
		this.CGMZ_GameOver_createCommandWindow();
	}
};
//-----------------------------------------------------------------------------
// Update CGMZ game over additions
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_update = Scene_Gameover.prototype.update;
Scene_Gameover.prototype.update = function() {
	if(CGMZ.GameOver.VideoVariable && this._cgmz_hasVideo) {
		this.updateCGMZVideo();
	}
	if(CGMZ.GameOver.ShowCommandWindow) {
		if(!CGMZ.GameOver.NumberOfCommands) {
			this.CGMZ_updateCommandPictures();
		}
		if(!this.isBusy()) {
			this._commandWindow.open();
		}
		Scene_Base.prototype.update.call(this);
	} else {
		alias_CGMZ_GameOver_update.call(this);
	}
};
//-----------------------------------------------------------------------------
// Update CGMZ Video
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.updateCGMZVideo = function() {
	const video = CGMZ_Video._element;
	this._cgmz_videoSprite.bitmap.clear();
	this._cgmz_videoSprite.bitmap.context.drawImage(video, 0, 0, Graphics.width, Graphics.height);
	this._cgmz_videoSprite.bitmap._baseTexture.update();
};
//-----------------------------------------------------------------------------
// Update command pictures
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_updateCommandPictures = function() {
	const currentCommand = this._commandWindow.currentSymbol();
	if(currentCommand && currentCommand !== this._cgmz_currentCommand) {
		this.CGMZ_unselectPicture(this._cgmz_currentCommand);
		this._cgmz_currentCommand = currentCommand;
		this.CGMZ_selectPicture(this._cgmz_currentCommand);
	}
};
//-----------------------------------------------------------------------------
// Unselect a picture by symbol
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_unselectPicture = function(symbol) {
	for(const picture of this._cgmz_commandPictures) {
		if(picture._symbol === symbol) {
			picture.setBitmapToInactive();
			break;
		}
	}
};
//-----------------------------------------------------------------------------
// Select a picture by symbol
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_selectPicture = function(symbol) {
	for(const picture of this._cgmz_commandPictures) {
		if(picture._symbol === symbol) {
			picture.setBitmapToActive();
			break;
		}
	}
};
//-----------------------------------------------------------------------------
// Check if Command Window is closing if enabled.
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.isBusy = function() {
	if(CGMZ.GameOver.ShowCommandWindow) {
		return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
	}
	return Scene_Base.prototype.isBusy.call(this);
};
//-----------------------------------------------------------------------------
// Create Command Window
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_createCommandWindow = function() {
	const rect = this.CGMZ_GameOver_commandWindowRect();
	this._commandWindow = new CGMZ_Window_GameOverCommand(rect);
	this._commandWindow.setHandler('continue', this.CGMZ_GameOver_commandContinue.bind(this));
	this._commandWindow.setHandler('title',	 this.CGMZ_GameOver_commandTitle.bind(this));
	this.CGMZ_GameOver_addCustomHandlers();
	this.addWindow(this._commandWindow);
	if(!CGMZ.GameOver.NumberOfCommands) {
		this.CGMZ_createCommandPictures();
	}
};
//-----------------------------------------------------------------------------
// Command window rect
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_commandWindowRect = function() {
	const ww = (CGMZ.GameOver.CommandWidth) ? Graphics.boxWidth * (CGMZ.GameOver.CommandWidth / 100.0) : this.mainCommandWidth();
	const wh = this.calcWindowHeight(CGMZ.GameOver.NumberOfCommands, true);
	const wx = (CGMZ.GameOver.NumberOfCommands) ? (Graphics.boxWidth - ww) / 2 + CGMZ.GameOver.XOffset : Graphics.width + 100;
	const wy = Graphics.boxHeight - wh - 96 + CGMZ.GameOver.YOffset;
	return new Rectangle(wx, wy, ww, wh);
};
//-----------------------------------------------------------------------------
// Add command pictures
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_createCommandPictures = function() {
	let order = 0;
	for(const picture of CGMZ.GameOver.Pictures) {
		const symbol = picture.symbol;
		for(const cmd of this._commandWindow._list) {
			if(cmd.symbol === symbol) {
				const sprite = new CGMZ_Sprite_GameOverPicture(picture, order++, this._commandWindow);
				this._cgmz_commandPictures.push(sprite);
				this.addChild(sprite);
			}
		}
	}
};
//-----------------------------------------------------------------------------
// Handling for custom Commands added through the plugin
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.commandCustom = function() {
	for(const cmd of CGMZ.GameOver.Commands) {
		if(this._commandWindow.currentSymbol() === cmd.symbol) {
			try {
				const hookFunc = new Function(cmd.js);
				hookFunc.call(this);
			}
			catch (e) {
				const origin = "[CGMZ] Game Over";
				const suggestion = "Check your JavaScript command";
				CGMZ_Utils.reportError(e.message, origin, suggestion);
			}
			break;
		}
	}
};
//-----------------------------------------------------------------------------
// Add custom commands
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_addCustomHandlers = function() {
	for(const cmd of CGMZ.GameOver.Commands) {
		if(this.isCustomCommand(cmd.symbol)) {
			this._commandWindow.setHandler(cmd.symbol, this.commandCustom.bind(this));
		}
	}
};
//-----------------------------------------------------------------------------
// Add custom commands
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.isCustomCommand = function(symbol) {
	return (symbol !== "title" && symbol !== "continue");
};
//-----------------------------------------------------------------------------
// Continue command handling
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_commandContinue = function() {
	this._commandWindow.close();
	SceneManager.push(Scene_Load);
};
//-----------------------------------------------------------------------------
// Title command handling
//-----------------------------------------------------------------------------
Scene_Gameover.prototype.CGMZ_GameOver_commandTitle = function() {
	this._commandWindow.close();
	this.fadeOutAll();
	AudioManager.stopAll();
	this.gotoTitle();
};
//-----------------------------------------------------------------------------
// Snap for background (scene file background) if showing command window
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_terminate = Scene_Gameover.prototype.terminate;
Scene_Gameover.prototype.terminate = function() {
	CGMZ_Video.pause();
	if(CGMZ.GameOver.ShowCommandWindow) {
		Scene_Base.prototype.terminate.call(this);
		SceneManager.snapForBackground();
		AudioManager.stopMe();
	} else {
		alias_CGMZ_GameOver_terminate.call(this);
	}
};
//-----------------------------------------------------------------------------
// No additional functionality if showing command window.
//-----------------------------------------------------------------------------
const alias_CGMZ_GameOver_stop = Scene_Gameover.prototype.stop;
Scene_Gameover.prototype.stop = function() {
	if(CGMZ.GameOver.ShowCommandWindow) {
		Scene_Base.prototype.stop.call(this);
	} else {
		alias_CGMZ_GameOver_stop.call(this);
	}
};
//=============================================================================
// CGMZ_Window_GameOverCommand
//-----------------------------------------------------------------------------
// Command Window showed on the Game Over scene.
//=============================================================================
function CGMZ_Window_GameOverCommand() {
	this.initialize(...arguments);
}
CGMZ_Window_GameOverCommand.prototype = Object.create(Window_Command.prototype);
CGMZ_Window_GameOverCommand.prototype.constructor = CGMZ_Window_GameOverCommand;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.initialize = function(rect) {
	Window_Command.prototype.initialize.call(this, rect);
	if(Imported.CGMZ_WindowSettings && CGMZ.GameOver.CommandWindowSettings) this.CGMZ_setWindowSettings(CGMZ.GameOver.CommandWindowSettings);
	if(Imported.CGMZ_WindowBackgrounds && CGMZ.GameOver.CommandWindowBackground) this.CGMZ_setWindowBackground(CGMZ.GameOver.CommandWindowBackground);
	this.openness = 0;
	this.selectLast();
};
//-----------------------------------------------------------------------------
// Command Position initialization
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand._lastCommandSymbol = null;
CGMZ_Window_GameOverCommand.initCommandPosition = function() {
	this._lastCommandSymbol = null;
};
//-----------------------------------------------------------------------------
// Create command list
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.makeCommandList = function() {
	for(const cmd of CGMZ.GameOver.Commands) {
		if(cmd.symbol === 'title') {
			this.addCommand(cmd.name, cmd.symbol, true, {icon: cmd.icon, img: cmd.backgroundImage, imgX: cmd.backImgX, imgY: cmd.backImgY});
		} else if(cmd.symbol === 'continue') {
			this.addCommand(cmd.name, cmd.symbol, this.isContinueEnabled(), {icon: cmd.icon, img: cmd.backgroundImage, imgX: cmd.backImgX, imgY: cmd.backImgY});
		} else {
			const showFunc = new Function(cmd.jsShow);
			if(showFunc.call(this)) {
				const enabledFunc = new Function(cmd.jsEnable);
				const enabled = enabledFunc.call(this);
				this.addCommand(cmd.name, cmd.symbol, enabled, {icon: cmd.icon, img: cmd.backgroundImage, imgX: cmd.backImgX, imgY: cmd.backImgY});
			}
		}
	}
};
//-----------------------------------------------------------------------------
// Check if continue enabled
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.isContinueEnabled = function() {
	return DataManager.isAnySavefileExists();
};
//-----------------------------------------------------------------------------
// Processing for OK button
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.processOk = function() {
	CGMZ_Window_GameOverCommand._lastCommandSymbol = this.currentSymbol();
	Window_Command.prototype.processOk.call(this);
};
//-----------------------------------------------------------------------------
// Choose which command to select
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.selectLast = function() {
	if(CGMZ_Window_GameOverCommand._lastCommandSymbol) {
		this.selectSymbol(CGMZ_Window_GameOverCommand._lastCommandSymbol);
	} else if(this.isContinueEnabled()) {
		this.selectSymbol("continue");
	} else {
		this.selectSymbol("title");
	}
};
//-----------------------------------------------------------------------------
// Change alignment of command text
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.itemTextAlign = function() {
	return CGMZ.GameOver.CommandAlignment;
};
//-----------------------------------------------------------------------------
// Get the command icon
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.CGMZ_icon = function(index) {
	return this._list[index].ext?.icon;
};
//-----------------------------------------------------------------------------
// Get selectable cgmz options
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.CGMZ_getSelectableCGMZOptions = function(index) {
	const ext = this._list[index].ext;
	if(ext && ext.img) {
		const bg = {
			img: ext.img,
			imgX: ext.imgX,
			imgY: ext.imgY
		}
		return {bg: bg};
	}
	return Window_Command.prototype.CGMZ_getSelectableCGMZOptions.call(this, index);
};
//-----------------------------------------------------------------------------
// Draw new command item with potential icon and text codes
//-----------------------------------------------------------------------------
CGMZ_Window_GameOverCommand.prototype.drawItem = function(index) {
	const rect = this.itemLineRect(index);
	const align = this.itemTextAlign();
	const icon = this.CGMZ_icon(index);
	this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
	if(icon) {
		const iconX = (CGMZ.GameOver.IconAlignment === 'left') ? rect.x : rect.x + rect.width - ImageManager.iconWidth;
		this.drawIcon(icon, iconX, rect.y + 2);
		rect.x += (ImageManager.iconWidth + 2) * (CGMZ.GameOver.IconAlignment === 'left');
		rect.width -= ImageManager.iconWidth + 2;
	}
	this.CGMZ_drawTextLine(this.commandName(index), rect.x, rect.y, rect.width, align);
};
//=============================================================================
// CGMZ_Sprite_GameOverPicture
//-----------------------------------------------------------------------------
// Pictures for commands
//=============================================================================
function CGMZ_Sprite_GameOverPicture() {
    this.initialize(...arguments);
}
CGMZ_Sprite_GameOverPicture.prototype = Object.create(Sprite_Clickable.prototype);
CGMZ_Sprite_GameOverPicture.prototype.constructor = CGMZ_Sprite_GameOverPicture;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.initialize = function(data, order, cmdWindow) {
	Sprite_Clickable.prototype.initialize.call(this);
	this._commandWindow = cmdWindow;
	this._symbol = data.symbol;
	this.anchor.x = 0;
	this.anchor.y = 0;
	const x = this.calculateX(data.xOffset, order);
	const y = this.calculateY(data.yOffset, order);
	this.move(x, y);
	this._inactiveBitmap = ImageManager.loadBitmap(data.imgInactive.folder, data.imgInactive.filename);
	this._activeBitmap = ImageManager.loadBitmap(data.imgActive.folder, data.imgActive.filename);
	this.bitmap = this._inactiveBitmap;
	this.CGMZ_setExact(true);
	this.show();
};
//-----------------------------------------------------------------------------
// Get picture x coordinate
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.calculateX = function(offset, order) {
	const base = CGMZ.GameOver.PictureBaseX + (CGMZ.GameOver.PictureAddX * order);
	return base + offset;
};
//-----------------------------------------------------------------------------
// Get picture y coordinate
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.calculateY = function(offset, order) {
	const base = CGMZ.GameOver.PictureBaseY + (CGMZ.GameOver.PictureAddY * order);
	return base + offset;
};
//-----------------------------------------------------------------------------
// Set the bitmap to the active bitmap
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.setBitmapToActive = function() {
    this.bitmap = this._activeBitmap;
};
//-----------------------------------------------------------------------------
// Set the bitmap to the inactive bitmap
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.setBitmapToInactive = function() {
    this.bitmap = this._inactiveBitmap;
};
//-----------------------------------------------------------------------------
// If mouse over, select the pic symbol
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.onMouseEnter = function() {
    this._commandWindow.selectSymbol(this._symbol);
};
//-----------------------------------------------------------------------------
// Call the command associated with the picture when clicked
//-----------------------------------------------------------------------------
CGMZ_Sprite_GameOverPicture.prototype.onClick = function() {
	this._commandWindow.selectSymbol(this._symbol);
	this._commandWindow.processOk();
};