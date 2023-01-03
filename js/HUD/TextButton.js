import { CST } from "../CST.js";

export class TextButton extends Phaser.GameObjects.Text
{
    /** Whether the button is currently pressed */
    pressed = false;

    /** Whether the button is enabled */
    enabled = true;

    /** Text color when there is no interaction from the user */
    normalColor = CST.STYLE.COLOR.TEXT.NORMAL;

    /** Text color when the user hover the text buton*/
    hoveredColor = CST.STYLE.COLOR.TEXT.HOVERED;

    /** Text color when the user pressed the text buton */
    pressedColor = CST.STYLE.COLOR.TEXT.PRESSED;

    /** Text color when the text buton is disabled */
    disabledColor = CST.STYLE.COLOR.TEXT.DISABLED;

    constructor(scene, x, y, text, style)
    {
        style.fontFamily = style.fontFamily ? style.fontFamily : "Gemunu Libre";
        style.fontSize = style.fontSize ? style.fontSize : "48px";
        style.fontStyle = style.fontStyle ? style.fontStyle : "bold";
        style.color = style.color ? style.color : CST.STYLE.COLOR.TEXT.NORMAL;
        style.align = style.align ? style.align : "center";
        style.stroke = style.stroke ? style.stroke : CST.STYLE.COLOR.BLACK;
        style.strokeThickness = style.strokeThickness ? style.strokeThickness : 3;
        
        super(scene, x, y, text, style);
        scene.add.existing(this);

        this.normalColor = style.color;
        this.hoveredColor = style.hoveredColor ? style.disabledColor : CST.STYLE.COLOR.TEXT.HOVERED;
        this.pressedColor = style.pressedColor ? style.disabledColor : CST.STYLE.COLOR.TEXT.PRESSED;
        this.disabledColor = style.disabledColor ? style.disabledColor : CST.STYLE.COLOR.TEXT.DISABLED;

        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains);
        
        // Behaviors
        this.on("pointerover", () => {
            if (this.enabled)
            {
                this.setColor(this.hoveredColor);
            }
        }, this);

        this.on("pointerout", () => {
            if (this.enabled)
            {
                this.pressed = false;
                this.setColor(this.normalColor);
            }
        }, this);

        this.on("pointerdown", () => {
            if (this.enabled)
            {
                this.pressed = true;
                this.setColor(this.pressedColor);
            }
        }, this);

        this.on("pointerup", () => {
            if (this.enabled)
            {
                this.pressed = false;
                this.setColor(this.hoveredColor);
            }
        }, this);

        this.on("pointermove", () => { this.setColor(this.pressed ? this.pressedColor : this.hoveredColor); }, this);
    }

    onClicked(fn, context)
    {
        this.on("pointerup", fn, context);
        return this;
    }

    onHovered(fn, context)
    {
        this.on("pointerover", fn, context);
        return this;
    }

    onPointerOut(fn, context)
    {
        this.on("pointerout", fn, context);
        return this;
    }

    setInteractive(hitArea, callback, dropZone)
    {
        this.setColor(this.normalColor);
        this.pressed = false;
        this.enabled = true;
        return super.setInteractive(hitArea, callback, dropZone);
    }

    disableInteractive()
    {
        this.setColor(this.disabledColor);
        this.pressed = false;
        this.enabled = false;
        return super.disableInteractive()
    }
}