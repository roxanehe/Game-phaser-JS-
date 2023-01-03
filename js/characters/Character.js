import { CST } from "../CST.js";
import { Meleehitbox } from "../weapons/meleehitbox.js";

export class Character extends Phaser.Physics.Arcade.Sprite
{
    // Attributes
    /** Walk speed */
    walkSpeed = 50;

    /** How high this character jumps */
    jumpVelocity = 400;
    
    // health system
    health = 10;

    // State - Walking
    /** Whether the character is walking */
    isWalking = false;

    isJumping = false;

    isMeleeAttacking = false;

    /** Whether the character is looking up */
    isLookingUp = false;

    /** Whether the character is looking on right direction */
    isLookingRight = false;
    
    Meleehitbox = undefined;

    hitboxOffsetX = 0;
    hitboxOffsetY = 0;
    hitboxWidth = 30;
    hitboxHeight = 32;


    constructor(scene, x, y)
    {
        super(scene, x, y, "");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body;
        body.setMaxSpeed(CST.PHYSIC.CHARACTER_MAX_SPEED);
        
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init(texture)
    {
        this.initStates();
        
        if (texture)
        {
            this.initAnimations(texture);
        }

        this.setCollideWorldBounds(true);
        this.Meleehitbox = new Meleehitbox(this.scene,this.x,this.y,this.hitboxWidth,this.hitboxHeight);
        this.Meleehitbox.character = this;
    }
    
    initStates()
    {
        this.isWalking = false;
    }

    initAnimations(texture)
    {
        this.setTexture(texture);
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    update()
    {
        super.update();

        this.updateAnimations();
        if(!this.isTakingDamage && !this.isDead()){
            this.updateControls();
        }
        this.Meleehitbox.setPosition(this.x + (this.flipX ? this.hitboxOffsetX : -this.hitboxOffsetX), this.y + this.hitboxOffsetY);
        
    }

    /** Update the anims of this Character */
    updateAnimations()
    {
    }

    /** Define the way to control this Character */
    updateControls()
    { 

    }
    

    // Walk
    ////////////////////////////////////////////////////////////////////////

    /** Whether this character is able to move */
    canMove()
    {
        return !this.isDead();
    }


    startWalking()
    {
        this.isWalking = true;
    }

    stopWalking()
    {
        if (this.isWalking)
        {
            this.setVelocityX(0);
            this.isWalking = false;
        }
    }

    walkOnLeft(walkSpeed)
    {   walkSpeed = walkSpeed?walkSpeed:this.walkSpeed
        this.lookOnLeft();

        const currentWalkSpeedY = this.body.velocity.y;
        this.walk(-walkSpeed, currentWalkSpeedY);
    }

    walkOnRight(walkSpeed)
    {
        walkSpeed = walkSpeed?walkSpeed:this.walkSpeed
        this.lookOnRight();

        const currentWalkSpeedY = this.body.velocity.y;
        this.walk(walkSpeed, currentWalkSpeedY);
    }

    walk(x, y)
    {
        if (this.canMove())
        {
            if (!this.isWalking)
            {
                this.startWalking();
            }

            this.setVelocity(x,y);
        }
    }

    // Look direction
    ////////////////////////////////////////////////////////////////////////

    lookUp()
    {
        this.isLookingUp = true;
    }

    lookDown()
    {
        this.isLookingUp = false;
    }
    
    lookOnRight()
    {
        this.isLookingRight = true;
    }

    lookOnLeft()
    {
        this.isLookingRight = false;
    }

    // Jump
    ////////////////////////////////////////////////////////////////////////

    canJump()
    {
        return this.body.onFloor() && !this.isDead();
    }

    jump()
    {
        if (this.canJump())
        {
            this.setVelocityY(-this.jumpVelocity);
            this.isJumping = true;
        }
    }

    die(){
        this.health = 0;
        this.stopWalking();
        this.emit("die")
    }
    isDead(){
        return this.health<=0;
    }

    meleeAttack(){
        this.isMeleeAttacking = true;
        this.Meleehitbox.body.enable = true;
      
    }
    stopMeleeAttack(){
       this.isMeleeAttacking = false;
       this.Meleehitbox.body.enable = false;
    }

    heal(healthPoint){
      this.health = Math.min(this.health+healthPoint,10);
    }

    hurt(pushOnRight, pushVelocity){

        if(!this.isDead()){
            this.health--;
            if(this.health<=0){
                this.die();
            }
            else{
                this.hurtAnimation(pushOnRight, pushVelocity);
                this.recover();
            }
        } 

    }

    hurtAnimation(pushOnRight,pushVelocity){
        this.isTakingDamage = true;
        if(pushOnRight){
            this.setVelocityX(pushVelocity)
            this.lookOnLeft();
        }else{
            this.setVelocityX(-pushVelocity)
            this.lookOnRight();
        }
        this.scene.time.delayedCall(300,this.stopHurtAnimation,null,this);
    }
    stopHurtAnimation(){
        this.isTakingDamage = false;
        this.setVelocityX(0);
    }
    recover(){
        this.isRecovering = true;
    }
    stopRecovering(){
        this.isRecovering = false;
    }
}