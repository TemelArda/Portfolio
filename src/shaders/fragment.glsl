uniform float u_time;
uniform sampler2D mask;
varying vec3 v_position;
void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec3 coordinates = vec3(v_position.x + 256., 0 , v_position.z + 256.); 
    vec2 uv = vec2(coordinates.x / 512., coordinates.z / 512.);
    gl_FragColor = vec4(v_position.x/512. , v_position.z/512., 0.0, 1.0) * .7 + .6;
    gl_FragColor.a *= maskTexture.a;

}