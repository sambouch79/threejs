import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { ObjectLoader, Vector3 } from 'three';

/**
 * Debug
 */
 const gui = new dat.GUI()

var cameraFar = 5;
var theModel={};
const TRAY = document.getElementById('js-slide');
var activeOption = 'LAME';

const BACKGROUND_COLOR = 0xf1f1f1;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR );
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio); 

document.body.appendChild(renderer.domElement);
//add cubeTextureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader()
/**
 * Environment map
 */
 const environmentMap = cubeTextureLoader.load([
   '3d/Texture/backgroud/0/px.jpg',
   '3d/Texture/backgroud/0/nx.jpg',
  '3d/Texture/backgroud/0/py.jpg',
  '3d/Texture/backgroud/0/ny.jpg',
  '3d/Texture/backgroud/0/pz.jpg',
  '3d/Texture/backgroud/0/nz.jpg'
])
scene.background = environmentMap
// Add a camerra
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;

// Init the object loader

var garde 


// load a resource


    var loader = new GLTFLoader()
    loader.load(
      '3d/masakute.glb',
        function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                 
                    const m = child
                    console.log(m)
                    m.receiveShadow = true
                     m.castShadow = true
                     garde=m
                }
              
             })
            //scene.add(gltf.scene)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )


loader.load('3d/MESHE.glb', function(gltf) {
  theModel = gltf.scene;
  theModel.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
      // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }
  });
// Set the models initial scale   
  theModel.scale.set(1.2,1.2,1.2);

  // Offset the y position 
  //theModel.position.y = -0.5;
  //theModel.rotation.y = Math.PI/8;

  // Add the model to the scene
  scene.add(theModel);

}, undefined, function(error) {
  console.error(error)
});
// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xABA8AD,
  shininess: 0
});


var floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
//scene.add(floor);

// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );

const INITIAL_MAP = [
 
  {childID: "TSUBA", mtl: INITIAL_MTL},
  {childID: "Kashira", mtl: INITIAL_MTL},
  {childID: "Kamon", mtl: INITIAL_MTL},
  {childID: "Tsuka", mtl: INITIAL_MTL},
  {childID: "Cube001", mtl: INITIAL_MTL},
  {childID: "LAME", mtl: INITIAL_MTL},
 

];
const meshes=[
  {name:"leto" ,type:'3d/leto.glb'},
  {name:"masakute",type: '3d/masakute.glb'},
  {name:"square",type:'3d/square.glb'} ,
  {name:"plain",type:'3d/plain.glb'} ,
  {name:"round",type:'3d/tree.glb'}, 
  {name:"holes",type:'3d/holes1.glb'} 
]

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type; 
       }
   }
 });
}
// Add the mesh to the models
function initMesh(parent, mesh1) {
  parent.traverse((o) => {
        if(o.nameID=="TSUBA"){
          console.log('meshparent',o)
           o.geometry=mesh1.geometry
           o.material=mesh1.material
           
           o.scale.set(8,10,8)
           if( mesh1.name==="Curve017_2" ){
             console.log(mesh1.name)
             o.rotation.x = Math.PI;
           }
           if(mesh1.name=="Curve029_1"){
            o.rotation.x = Math.PI/2;
           }
        }
})
}

// Add lights
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
    hemiLight.position.set( 0, 50, 0 );
// Add hemisphere light to scene   
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
    dirLight.position.set( -8, 12, 8 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene    
    scene.add( dirLight );
// Add controls
var controls = new OrbitControls( camera, renderer.domElement );

controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; 
controls.autoRotateSpeed = 0.2; // 30


//stats
const stats = Stats()
document.body.appendChild(stats.dom)

//animate
    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      controls.update();
      stats.update()
      //console.log(theModel)
    }

animate();


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    
    renderer.setSize(width, height, false);
  }
  return needResize;
}
const colors = [
  {
    texture: './3d/texture/Texture_saya.jpg',
    size: [2,2,2],
    shininess: 60
},
{
    texture: './3d/texture/Texture_lame1.jpg',
    size: [1, 1, 1],
    shininess: 0
},
{
  texture: './3d/texture/Texture_Kamon.jpg',
  size: [1,1,1],
  shininess: 60
},
{
  texture: './3d/texture/TSUKA_TEXTURE.png',
  size: [1, 1, 1],
  shininess: 0
},
  {
      color: '900C3F'
      
  },
  {
      color: '6C3483'
  },
  {
      color: '153944'
  },
  {
      color: '27548D'
  },
  
  ]


  // Function - Build Colors
  function buildColors(colors) {
    for (let [i, color] of colors.entries()) {
      let swatch = document.createElement('div');
      swatch.classList.add('tray__swatch');
      
      if (color.texture)
      {
        swatch.style.backgroundImage = "url(" + color.texture + ")";   
      } else
      {
        swatch.style.background = "#" + color.color;
      }
  
      swatch.setAttribute('data-key', i);
      TRAY.append(swatch);
    }
  }

buildColors(colors);
// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}
/* function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

   new_mtl = new THREE.MeshPhongMaterial({
       color: parseInt('0x' + color.color),
       shininess: color.shininess ? color.shininess : 10
       
     });
     setMaterial(theModel, activeOption, new_mtl);
    //setMaterial(theModel, 'LAME', new_mtl);

 //setMaterial(theModel, activeOption, new_mtl);
} */
function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  console.log(color)
  let new_mtl;

 if (color.texture) {
   
   let txt = new THREE.TextureLoader().load(color.texture);
   
   txt.repeat.set( color.size[0], color.size[1], color.size[2]);
   txt.wrapS = THREE.RepeatWrapping;
   txt.wrapT = THREE.RepeatWrapping;
   
   new_mtl = new THREE.MeshPhongMaterial( {
     map: txt,
     shininess: color.shininess ? color.shininess : 10
   });    
 } 
 else
 {
   new_mtl = new THREE.MeshPhongMaterial({
       color: parseInt('0x' + color.color),
       shininess: color.shininess ? color.shininess : 10
       
     });
 }
 
 setMaterial(theModel, activeOption, new_mtl);
}
function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh && o.nameID != null) {
     if (o.nameID == type) {
          o.material = mtl;
       }
   }
 });
}

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click',selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}
// Select mesh Option 
const options1= document.querySelectorAll(".option1");

for (const option of options1) {
  console.log(option)
  option.addEventListener('click',selectOption1);
 
}

function selectOption1(e) {
  var m
  console.log(e.target.dataset.option)
  let option1 = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options1) {
    
    otherOption.classList.remove('--is-active');
  }
  option1.classList.add('--is-active');
  const mesh=meshes.find(e=>e.name==activeOption)
  console.log('meshtype',mesh.type)
  
  loader.load(
    mesh.type,
      function (gltf) {
          gltf.scene.traverse(function (child) {
              if (child.isMesh) {
                  m = child
                  console.log(m.geometry)
                  m.receiveShadow = true
                   m.castShadow = true
                  
                   //garde=m
              }
             
           })
           console.log('mmm',m)
         
           initMesh(theModel,m) 
         //scene.add(gltf.scene)
      })
   

}

 