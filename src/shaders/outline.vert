#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this vertex shader to move the edge vertex
// along the normal away from the mesh surface if you determine
// that the vertex belongs to a silhouette edge.

precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform float thickness;

in vec3 position;
in vec3 normal;
in vec3 leftNormal;
in vec3 rightNormal;

void main() 
{
    // Defining a vector that points to the eye in eye-space
    vec3 to_eye = vec3(0, 0, 0) - normalize(modelViewMatrix * vec4(position, 1)).xyz;

    // Transforming the left and right normals to eye-space
    vec3 nl = normalize(normalMatrix * vec4(leftNormal, 1)).xyz;
    vec3 nr = normalize(normalMatrix * vec4(rightNormal, 1)).xyz;

    // Defining a vector to handle modifying the vertex position in an outline is necessary
    vec3 posOffset = position;

    // Checking if a vertex is on the edge of the model in eye-space and translating it if it is
    if (dot(to_eye, nl) * dot(to_eye, nr) < 0.0) {
        posOffset = position + normal * thickness;
    }

    // Setting the position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(posOffset, 1);
}