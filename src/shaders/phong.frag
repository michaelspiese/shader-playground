#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this fragment shader to implement per-pixel illumination.
// The code will be similar to the per-vertex illumination shading
// implemented in GopherGfx/shaders/gouraud.vert.

precision mediump float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

const int MAX_LIGHTS = 16;

uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

uniform int numLights;
uniform int lightTypes[MAX_LIGHTS];
uniform vec3 lightPositions[MAX_LIGHTS];
uniform vec3 ambientIntensities[MAX_LIGHTS];
uniform vec3 diffuseIntensities[MAX_LIGHTS];
uniform vec3 specularIntensities[MAX_LIGHTS];
uniform vec3 eyePosition;

in vec3 vertPosition;
in vec3 vertNormal;
in vec4 vertColor;

out vec4 fragColor;

void main() 
{   
    // Re-normalizing the vertex normal vector to prevent unknown behavior
    vec3 fragNormal = normalize(vertNormal);

    vec3 illumination = vec3(0, 0, 0);
    for(int i=0; i < numLights; i++)
    {
        // Calculating and adding the ambient component to the illumination
        illumination += kAmbient * ambientIntensities[i];

        // Computing the vector that points from the vertex to the light
        // This is based on the light source being used
        vec3 light;
        if(lightTypes[i] == DIRECTIONAL_LIGHT)
            light = normalize(lightPositions[i]);
        else
            light = normalize(lightPositions[i] - vertPosition);
        
        // Calculating and adding the diffuse component to the illumination
        float diffuseComponent = max(dot(fragNormal, light), 0.0);
        illumination += diffuseComponent * kDiffuse * diffuseIntensities[i];

        // Computing the vector from the vertex to the eye
        vec3 to_eye = normalize(eyePosition - vertPosition);   
        
        // Computing the light vector reflected about the normal
        vec3 ref = reflect(-light, fragNormal);

        // Calculating and adding the specular component to the illumination
        float specularComponent = pow(max(dot(to_eye, ref), 0.0), shininess);
        illumination += specularComponent * kSpecular * specularIntensities[i];
    }

    // Setting the color and illumination of each pixel based on what was calculated above
    fragColor = vertColor;
    fragColor.rbg *= illumination;
}