import ISystem from "../types";

import { Animation, Skeleton } from "@babylonjs/core";

export const animateProjectionPlane = ({ world: w, components: c, entities: e }: ISystem, height: number, width: number)  => {
    let animations = w.entityManager.getComponent(e.projectionPlane, c.standardAnimation)[0];
     
    const scaleAnims = [
      {
        name: "scalex",
        fps: 30,
        property: "scaling.x",
        enabled: true,
        startFrame: 0,
        created: false,
        loop: false,
        callback : () => {
        },
        animationType: Animation.ANIMATIONTYPE_FLOAT,
        keyFrames: [
          {
            frame: 0, 
            value: 0,
          },
          {
            frame: 5, 
            value: width,
          }, 
        ]
      },
      {
        name: "scaley",
        fps: 30,
        property: "scaling.y",
        enabled: true,
        startFrame: 0,
        created: false,
        loop: false,
        callback : () => {
        },
        animationType: Animation.ANIMATIONTYPE_FLOAT,
        keyFrames: [
          {
            frame: 0, 
            value: 0,
          },
          {
            frame: 5, 
            value: height,
          }, 
        ]
      }
    ];
    
    for(const anim of scaleAnims) {
      animations.push(anim);
    }
};

export const animateProjectionCube = ({ world: w, components: c, entities: e }: ISystem, projEntId: number, height: number, width: number)  => {
    if(!w.entityManager.hasComponent(projEntId, c.standardAnimation)) {
        w.entityManager.addComponent(projEntId, c.standardAnimation, []);
      } 
        let projAnimations = w.entityManager.getComponent(projEntId, c.standardAnimation)[w.entityManager.getArchTypeId(projEntId)];

        projAnimations.push(
          {
            name: "scalezplane",
            fps: 30,
            property: "scaling.z",
            enabled: true,
            startFrame: 0,
            created: false,
            loop: false,
            callback : () => {
                animateProjectionPlane({ world: w, components: c, entities: e }, height, width);
            },
            animationType: Animation.ANIMATIONTYPE_FLOAT,
            keyFrames: [
              {
                frame: 0, 
                value: 0,
              },
              {
                frame: 5, 
                value: -1,
              }, 
            ]
          }
        );
        projAnimations.push({
          name: "scaleyplane",
          fps: 30,
          property: "scaling.x",
          enabled: true,
          startFrame: 0,
          created: false,
          loop: false,
          callback : () => {
          },
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          keyFrames: [
            {
              frame: 0, 
              value: 0,
            },
            {
              frame: 5, 
              value: 1,
            }, 
          ]
        });
    
}


export const stopCharacterAnimation = ({ world: w, components: c, entities: e }: ISystem)  => {
    w.scene.animationGroups[0].start();
    w.scene.animationGroups[0].loopAnimation = true;
    w.scene.animationGroups[1].stop();

}

export const startCharacterAnimation = ({ world: w, components: c, entities: e }: ISystem)  => {
    w.scene.animationGroups[1].start();
    w.scene.animationGroups[1].loopAnimation = true;
    w.scene.animationGroups[0].stop();

}

