document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');

    const thumbnails = [
        { url: './assets/html/Alien Animation.html',    imgSrc: './assets/thumbnails/Alien Animation.png',      title: 'Alien Animation - Azran' },
        { url: './assets/html/Chatbot.html',            imgSrc: './assets/thumbnails/Chatbot.png',              title: 'Chatbot - Saliha' },
        { url: './assets/html/Chef Game.html',          imgSrc: './assets/thumbnails/Chef Game.png',            title: 'Chef Game - Luthfiyah' },
        { url: './assets/html/Dart Game.html',          imgSrc: './assets/thumbnails/Dart Game.png',            title: 'Dart Game - Saliha' },
        { url: './assets/html/Fast Clicker.html',       imgSrc: './assets/thumbnails/Fast Clicker.png',         title: 'Fast Clicker - Ali' },
        { url: './assets/html/Fighting Game.html',      imgSrc: './assets/thumbnails/Fighting Game.png',        title: 'Fighting Game - Adam' },
        { url: './assets/html/FluffyBird.html',         imgSrc: './assets/thumbnails/FluffyBird.png',           title: 'FluffyBird - Shmaya' },
        { url: './assets/html/Math Game.html',          imgSrc: './assets/thumbnails/Math Game.png',            title: 'Math Game - Ali' },
        { url: './assets/html/Maze Game.html',          imgSrc: './assets/thumbnails/Maze Game.png',            title: 'Maze Game - Saliha' },
        { url: './assets/html/Memory Game 2.html',      imgSrc: './assets/thumbnails/Memory Game 2.png',        title: 'Memory Game - Luthfiyah' },
        { url: './assets/html/Memory Game.html',        imgSrc: './assets/thumbnails/Memory Game.png',          title: 'Memory Game - Adelina & Safirah' },
        { url: './assets/html/Plant Vs Zombie.html',    imgSrc: './assets/thumbnails/Plant Vs Zombie.jpg',      title: 'Plant Vs Zombie - Abieman' },
        { url: './assets/html/Platform shooter.html',   imgSrc: './assets/thumbnails/Platform shooter.png',     title: 'Platform shooter' },
        { url: './assets/html/Platformer Game 2.html',  imgSrc: './assets/thumbnails/Platformer Game 2.png',    title: 'Platformer Game - Luthfiyah' },
        { url: './assets/html/Platformer Game.html',    imgSrc: './assets/thumbnails/Platformer Game.png',      title: 'Platformer Game - Niveshaa' },
        { url: './assets/html/Pokemon.html',            imgSrc: './assets/thumbnails/Pokemon.png',              title: 'Pokemon - Aaraatanhaa' },
        { url: './assets/html/Quiz Game.html',          imgSrc: './assets/thumbnails/Quiz Game.png',            title: 'Quiz Game - Hana' },
        { url: './assets/html/Scroller Game.html',      imgSrc: './assets/thumbnails/Scroller Game.png',        title: 'Scroller Game - Safirah' },
        { url: './assets/html/Smiley Animation.html',   imgSrc: './assets/thumbnails/Smiley Animation.png',     title: 'Smiley Animation - Auf' },
        { url: './assets/html/The Flying Cat.html',     imgSrc: './assets/thumbnails/The Flying Cat.png',       title: 'The Flying Cat - Ammar' },
        { url: './assets/html/Zombie Shooter.html',     imgSrc: './assets/thumbnails/Zombie Shooter.png',       title: 'Zombie Shooter - General' }
    ];

    thumbnails.forEach(thumbnail => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        thumbnailDiv.setAttribute('data-url', thumbnail.url);

        const img = document.createElement('img');
        img.src = thumbnail.imgSrc;
        img.alt = thumbnail.title;

        const title = document.createElement('p');
        title.textContent = thumbnail.title;

        thumbnailDiv.appendChild(img);
        thumbnailDiv.appendChild(title);

        thumbnailDiv.addEventListener('click', () => {
            window.open(thumbnail.url, '_blank');
        });

        galleryContainer.appendChild(thumbnailDiv);
    });
});

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container, rocket, HEIGHT, WIDTH;

const createScene = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x94B3FD, 10, 1500); // Updated to match your color scheme

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.x = 0;
    camera.position.z = 500;
    camera.position.y = -10;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById("canvas");
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", handleWindowResize, false);

    let loader = new THREE.GLTFLoader();
    loader.load("https://stivs.dev/assets/rocket/rocket.gltf",
        (gltf) => {
            rocket = gltf.scene;
            rocket.position.y = 50;
            scene.add(rocket);
        }
    );
};