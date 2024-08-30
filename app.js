// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    getResponsiveFOV(), 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Function to get responsive FOV
function getResponsiveFOV() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    return aspectRatio < 1 ? 90 : 75; // Wider FOV on narrower screens
}

// Create a sphere geometry and material
const sphereGeometry = new THREE.SphereGeometry(3.5, 64, 64);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x0077ff, wireframe: true });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Create a simple car geometry and material
const carGeometry = new THREE.BoxGeometry(0.2, 0.15, 1);
const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0.5, sphereGeometry.parameters.radius + 0.5);
scene.add(car);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Position the camera
camera.position.z = 8;

// Variables to control the sphere's rotation
let carTheta = Math.PI / 4; // Latitude angle (around the Y-axis)
let carPhi = Math.PI / 2;   // Longitude angle (around the X-axis)

function updateSphereRotation() {
    sphere.rotation.y = carPhi;
    sphere.rotation.x = carTheta;
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Handle keyboard controls for rotating the sphere
document.addEventListener('keydown', (event) => {
    const key = event.key;

    const rotationSpeed = 0.05; // Adjust the speed as needed

    if (key === 'ArrowUp') {
        carTheta += rotationSpeed; // Rotate the sphere upward (car moves forward)
    } else if (key === 'ArrowDown') {
        carTheta -= rotationSpeed; // Rotate the sphere downward (car moves backward)
    } else if (key === 'ArrowLeft') {
        carPhi += rotationSpeed; // Rotate the sphere left (car turns left)
    } else if (key === 'ArrowRight') {
        carPhi -= rotationSpeed; // Rotate the sphere right (car turns right)
    }

    updateSphereRotation();
});

// Handle touch controls for mobile devices
document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    if (touch.clientX < halfWidth && touch.clientY < halfHeight) {
        carTheta += 0.05; // Move forward
    } else if (touch.clientX < halfWidth && touch.clientY >= halfHeight) {
        carTheta -= 0.05; // Move backward
    } else if (touch.clientX >= halfWidth && touch.clientY < halfHeight) {
        carPhi += 0.05; // Turn left
    } else if (touch.clientX >= halfWidth && touch.clientY >= halfHeight) {
        carPhi -= 0.05; // Turn right
    }

    updateSphereRotation();
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = getResponsiveFOV();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
