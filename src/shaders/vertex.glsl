#define PI 3.14159265358979323846

uniform float u_time;
uniform float mouseClickX;
uniform float mouseClickY;
varying vec3 v_position;


vec3 Wave(float x, float z){
    vec3 pos = vec3(x, 0.0, z);
    pos.y = sin( PI * (pos.x  + pos.z ) * 0.005 + u_time * 0.01) * 100.0 ;
    return pos;
}

vec3 MultiWave(float x, float z){
    vec3 pos = vec3(x, 0.0, z);
    pos.y = sin( (pos.x  + pos.z )* 0.01 + u_time * 0.01) * 100.0;
    pos.y += sin(  pos.x * 0.09 + u_time * 0.04) * 10.0;
    pos.y += sin(  pos.z * 0.01 + u_time * 0.04) * 5.0;
    return pos;
}

vec3 Ripple(float x, float z){
    vec3 pos = vec3(x, 0.0, z);
    float d = distance(pos.xz, vec2(mouseClickX, mouseClickY));
    pos.y = sin( PI/1000. * (4. * d - u_time * 5.)) * 50.;
    pos.y /=  1. + 4. * d * .005  ;
    return pos;
}

vec3 Sphere(float x, float z){
    float r  = cos(.5 * PI * z) * 100.0;
    vec3 pos = vec3( r * sin(PI * x), z, r * cos(PI * x));
    //pos.y = sin( PI * .5 * pos.z) * 256.;
    return pos;
}

void main(){
    vec3 pos = position;

    pos = Ripple(position.x, position.z);
    

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 1000. * (1./ -mvPosition.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );;
    v_position = pos;
}

