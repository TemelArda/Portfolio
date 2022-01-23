uniform float u_time;
uniform sampler2D mask;
uniform sampler2D texture1;
uniform float texture_influence;
uniform vec2 resolution;

varying vec3 v_position;
varying vec2 vUv;

void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec4 texColor = texture2D(texture1, vUv);
    vec4 color = vec4(.15 , vUv.y + .15, vUv.x, 1.0) + .3 ;
    
    gl_FragColor = mix(color, texColor, clamp(texture_influence, 0.0, 1.0));
    gl_FragColor.a *= maskTexture.a;

}